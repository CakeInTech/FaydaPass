
interface FaydaUserInfo {
  sub?: string;
  email?: string;
  phone_number?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  birthdate?: string;
  gender?: string;
  address?: {
    formatted?: string;
    street_address?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

export async function extractUserInfoFromToken(accessToken: string): Promise<FaydaUserInfo | null> {
  try {
    // For now, we'll decode without verification since we don't have the public key
    // In production, you should verify the token with the issuer's public key
    const parts = accessToken.split('.');
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    console.log("Decoded user info from token:", payload);
    return payload as FaydaUserInfo;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export async function getUserEmailFromToken(accessToken: string): Promise<string | null> {
  const userInfo = await extractUserInfoFromToken(accessToken);
  return userInfo?.email || userInfo?.sub || null;
}

export async function getUserNameFromToken(accessToken: string): Promise<string | null> {
  const userInfo = await extractUserInfoFromToken(accessToken);
  return userInfo?.name || 
         (userInfo?.given_name && userInfo?.family_name 
           ? `${userInfo.given_name} ${userInfo.family_name}` 
           : null);
} 