"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createCompany, getUserByEmail } from "@/lib/supabase";

// This function is now aligned with the Verification interface in lib/supabase.ts
export async function createVerification(data: {
  user_email: string;
  status: "success" | "failure" | "pending";
  type: "KYC" | "biometric";
  api_provider: "fayda" | "internal";
  selfie_url?: string;
  metadata?: Record<string, any>;
}) {
  const { user_email, status, type, api_provider, selfie_url, metadata } = data;

  // Corrected table name to 'verifications'
  const supabase = createClient();
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { error } = await supabase.from("verifications").insert([
    {
      user_email,
      status,
      type,
      api_provider,
      selfie_url,
      metadata,
      // Set default values for required fields not passed in
      match_score: 0,
      liveness_score: 0,
    },
  ]);

  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to Create Verification.");
  }

  revalidatePath("/dashboard/verifications");
}

export async function login(prevState: any, formData: FormData) {
  const supabase = createClient();
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  const validatedFields = schema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    };
  }

  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      ...prevState,
      message: error.message,
    };
  }

  const user = await getUserByEmail(email);
  if (user?.user_type === "developer") {
    revalidatePath("/developer-dashboard");
    redirect("/developer-dashboard");
  } else if (user?.user_type === "company_user") {
    revalidatePath("/company-dashboard");
    redirect("/company-dashboard");
  } else if (user?.user_type === "admin") {
    revalidatePath("/admin/dashboard");
    redirect("/admin/dashboard");
  }

  revalidatePath("/");
  redirect("/");
}

export async function signupDeveloper(prevState: any, formData: FormData) {
  const supabase = createClient();
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    use_case: z.string().min(1, "Use case is required"),
  });

  const validatedFields = schema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Sign Up.",
    };
  }

  const { name, email, password, use_case } = validatedFields.data;

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        user_type: "developer",
      },
    },
  });

  if (error) {
    return {
      ...prevState,
      message: error.message,
    };
  }

  if (user) {
    // Insert into users table immediately after auth signup
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: user.id,
        name,
        email,
        user_type: "developer",
        use_case,
      },
    ]);
    if (dbError) {
      return {
        ...prevState,
        message: dbError.message || "Failed to create user profile.",
      };
    }
  }

  revalidatePath("/developer-dashboard");
  redirect("/developer-dashboard");
}

export async function signupCompany(prevState: any, formData: FormData) {
  const supabase = createClient();
  const schema = z.object({
    company_name: z.string().min(1, "Company name is required"),
    contact_name: z.string().min(1, "Contact name is required"),
    contact_email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    contact_phone: z.string().optional(),
    website: z.string().optional(),
    industry: z.string().min(1, "Industry is required"),
    employee_count: z.string().min(1, "Employee count is required"),
    use_case: z.string().optional(),
    expected_volume: z.string().min(1, "Expected volume is required"),
    compliance_requirements: z.array(z.string()).optional(),
  });

  const validatedFields = schema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Sign Up.",
    };
  }

  const {
    company_name,
    contact_name,
    contact_email,
    password,
    ...companyData
  } = validatedFields.data;

  const company = await createCompany({
    name: company_name,
    contact_email: contact_email,
    ...companyData,
  });

  if (!company) {
    return {
      ...prevState,
      message: "Failed to create company.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.signUp({
    email: contact_email,
    password,
    options: {
      data: {
        name: contact_name,
        user_type: "company_user",
        company_id: company.id,
      },
    },
  });

  if (userError) {
    // TODO: Handle company cleanup if user creation fails
    return {
      ...prevState,
      message: userError.message,
    };
  }

  if (user) {
    // Insert into users table immediately after auth signup
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: user.id,
        name: contact_name,
        email: contact_email,
        user_type: "company_user",
        company_id: company.id,
      },
    ]);
    if (dbError) {
      return {
        ...prevState,
        message: dbError.message || "Failed to create user profile.",
      };
    }
  }

  revalidatePath("/company-dashboard");
  redirect("/company-dashboard");
}
