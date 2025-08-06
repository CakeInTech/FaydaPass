<?php
/**
 * FaydaPass PHP SDK Example
 *
 * This example demonstrates how to integrate FaydaPass KYC verification
 * into your PHP application using Laravel or Symfony.
 */

class FaydaPassSDK
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct(string $apiKey, string $baseUrl = 'https://api.faydapass.com')
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
    }

    /**
     * Validate your API key
     */
    public function validateApiKey(): array
    {
        try {
            $response = $this->makeRequest('/api/sdk/validate', [
                'apiKey' => $this->apiKey
            ]);

            return $response;
        } catch (Exception $e) {
            error_log("❌ API Key validation failed: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Initiate a KYC verification for a user
     */
    public function initiateVerification(string $userEmail, string $redirectUrl): array
    {
        try {
            $response = $this->makeRequest('/api/sdk/initiate', [
                'apiKey' => $this->apiKey,
                'userEmail' => $userEmail,
                'redirectUrl' => $redirectUrl
            ]);

            return $response;
        } catch (Exception $e) {
            error_log("❌ Verification initiation failed: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Check the status of a verification
     */
    public function getVerificationStatus(string $verificationId): array
    {
        try {
            $response = $this->makeRequest('/api/sdk/status', [
                'apiKey' => $this->apiKey,
                'verificationId' => $verificationId
            ]);

            return $response;
        } catch (Exception $e) {
            error_log("❌ Status check failed: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * List all verifications for your company
     */
    public function listVerifications(): array
    {
        try {
            $response = $this->makeRequest('/api/sdk/list', [
                'apiKey' => $this->apiKey
            ]);

            return $response;
        } catch (Exception $e) {
            error_log("❌ List verifications failed: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get API usage statistics
     */
    public function getUsageStats(): array
    {
        try {
            $response = $this->makeRequest('/api/sdk/usage', [
                'apiKey' => $this->apiKey
            ]);

            return $response;
        } catch (Exception $e) {
            error_log("❌ Usage stats failed: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Make HTTP request to FaydaPass API
     */
    private function makeRequest(string $endpoint, array $data): array
    {
        $url = $this->baseUrl . $endpoint;

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->apiKey
            ],
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => true
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("cURL Error: " . $error);
        }

        if ($httpCode >= 400) {
            $errorData = json_decode($response, true);
            throw new Exception($errorData['error'] ?? "HTTP Error: " . $httpCode);
        }

        return json_decode($response, true);
    }
}

// Example usage
function example()
{
    // Initialize the SDK with your API key
    $faydaPass = new FaydaPassSDK('fp_ethiobank_2025_abc123');

    try {
        // 1. Validate your API key
        echo "🔑 Validating API key...\n";
        $validation = $faydaPass->validateApiKey();
        echo "✅ API key valid: " . json_encode($validation) . "\n";

        // 2. Initiate a verification
        echo "\n🚀 Initiating verification...\n";
        $verification = $faydaPass->initiateVerification(
            'user@example.com',
            'https://yourapp.com/callback'
        );
        echo "✅ Verification initiated: " . json_encode($verification) . "\n";

        // 3. Check verification status
        echo "\n📊 Checking verification status...\n";
        $status = $faydaPass->getVerificationStatus($verification['verificationId']);
        echo "✅ Verification status: " . json_encode($status) . "\n";

        // 4. List all verifications
        echo "\n📋 Listing all verifications...\n";
        $verifications = $faydaPass->listVerifications();
        echo "✅ Found " . count($verifications['verifications']) . " verifications\n";

        // 5. Get usage statistics
        echo "\n📈 Getting usage statistics...\n";
        $usage = $faydaPass->getUsageStats();
        echo "✅ Usage stats: " . json_encode($usage) . "\n";

    } catch (Exception $error) {
        echo "❌ Error: " . $error->getMessage() . "\n";
    }
}

// Laravel integration example
function laravelIntegration()
{
    // This would be in a Laravel controller
    class VerificationController extends Controller
    {
        private FaydaPassSDK $faydaPass;

        public function __construct()
        {
            $this->faydaPass = new FaydaPassSDK(config('faydapass.api_key'));
        }

        public function startVerification(Request $request)
        {
            try {
                $request->validate([
                    'userEmail' => 'required|email',
                    'redirectUrl' => 'required|url'
                ]);

                $verification = $this->faydaPass->initiateVerification(
                    $request->userEmail,
                    $request->redirectUrl
                );

                return response()->json([
                    'success' => true,
                    'verificationId' => $verification['verificationId'],
                    'redirectUrl' => $verification['redirectUrl']
                ]);

            } catch (Exception $error) {
                return response()->json([
                    'success' => false,
                    'error' => $error->getMessage()
                ], 400);
            }
        }

        public function checkStatus($verificationId)
        {
            try {
                $status = $this->faydaPass->getVerificationStatus($verificationId);

                return response()->json([
                    'success' => true,
                    'status' => $status
                ]);

            } catch (Exception $error) {
                return response()->json([
                    'success' => false,
                    'error' => $error->getMessage()
                ], 400);
            }
        }

        public function callback(Request $request)
        {
            $verificationId = $request->query('verificationId');
            $status = $request->query('status');

            Log::info("Verification {$verificationId} completed with status: {$status}");

            // Handle the callback - update your database, notify user, etc.
            return response()->json([
                'success' => true,
                'message' => 'Verification callback received'
            ]);
        }

        public function listVerifications()
        {
            try {
                $verifications = $this->faydaPass->listVerifications();

                return response()->json([
                    'success' => true,
                    'verifications' => $verifications['verifications']
                ]);

            } catch (Exception $error) {
                return response()->json([
                    'success' => false,
                    'error' => $error->getMessage()
                ], 400);
            }
        }

        public function usageStats()
        {
            try {
                $stats = $this->faydaPass->getUsageStats();

                return response()->json([
                    'success' => true,
                    'stats' => $stats
                ]);

            } catch (Exception $error) {
                return response()->json([
                    'success' => false,
                    'error' => $error->getMessage()
                ], 400);
            }
        }
    }
}

// Symfony integration example
function symfonyIntegration()
{
    // This would be in a Symfony controller
    class VerificationController extends AbstractController
    {
        private FaydaPassSDK $faydaPass;

        public function __construct()
        {
            $this->faydaPass = new FaydaPassSDK($_ENV['FAYDAPASS_API_KEY']);
        }

        #[Route('/verify', name: 'start_verification', methods: ['POST'])]
        public function startVerification(Request $request): JsonResponse
        {
            try {
                $data = json_decode($request->getContent(), true);

                $verification = $this->faydaPass->initiateVerification(
                    $data['userEmail'],
                    $data['redirectUrl']
                );

                return $this->json([
                    'success' => true,
                    'verificationId' => $verification['verificationId'],
                    'redirectUrl' => $verification['redirectUrl']
                ]);

            } catch (Exception $error) {
                return $this->json([
                    'success' => false,
                    'error' => $error->getMessage()
                ], 400);
            }
        }

        #[Route('/verify/{verificationId}', name: 'check_status', methods: ['GET'])]
        public function checkStatus(string $verificationId): JsonResponse
        {
            try {
                $status = $this->faydaPass->getVerificationStatus($verificationId);

                return $this->json([
                    'success' => true,
                    'status' => $status
                ]);

            } catch (Exception $error) {
                return $this->json([
                    'success' => false,
                    'error' => $error->getMessage()
                ], 400);
            }
        }

        #[Route('/callback', name: 'verification_callback', methods: ['GET'])]
        public function callback(Request $request): JsonResponse
        {
            $verificationId = $request->query->get('verificationId');
            $status = $request->query->get('status');

            // Log the callback
            $this->logger->info("Verification {$verificationId} completed with status: {$status}");

            return $this->json([
                'success' => true,
                'message' => 'Verification callback received'
            ]);
        }
    }
}

// Run the example if this file is executed directly
if (basename(__FILE__) == basename($_SERVER['SCRIPT_NAME'])) {
    example();
}
?>
