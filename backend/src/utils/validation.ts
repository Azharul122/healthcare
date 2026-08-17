import { optional, z } from "zod";

// ---------- UUID ----------
export const uuidSchema = z.uuid({ message: "Invalid ID format" });

// ---------- UUID Array ----------
export const uuidArraySchema = (message = "Please select at least one item") =>
  z.array(uuidSchema).min(1, message);

// ---------- ID ----------
export const idParamSchema = z.object({
  id: uuidSchema,
});

// ---------- Email ----------
export const emailSchema = z
  .email({ message: "Invalid email address" })
  .min(1, "Email is required")
  .toLowerCase()
  .trim();

// ---------- Phone (Bangladesh format) ----------
export const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^(?:\+?88)?01[3-9]\d{8}$/,
    "Invalid phone number format (e.g. 01712345678)"
  );


  // ---------- Name ----------
export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name is too long")
  .regex(/^[a-zA-Z\s.]+$/, "Name can only contain letters and spaces");

// ---------- Password ----------
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number");

// ---------- Date of Birth ----------
export const dobSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
  .refine((val) => new Date(val) < new Date(), "Date of birth cannot be in the future");

// ---------- Gender ----------
export const genderSchema = z.enum(["male", "female", "other"], {
  message: "Gender must be male, female or other",
});

// ---------- Blood Group (healthcare specific — apnar khub kaje lagbe) ----------
export const bloodGroupSchema = z.enum(
  ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  { message: "Invalid blood group" }
);

// ---------- NID / Birth Certificate Number (BD specific) ----------
export const nidSchema = z
  .string()
  .regex(/^\d{10}$|^\d{13}$|^\d{17}$/, "Invalid NID number");

// ---------- Age ----------
export const ageSchema = z
  .number()
  .int()
  .min(0, "Age cannot be negative")
  .max(120, "Invalid age");

// ---------- Price / Fee (doctor consultation fee er jonno) ----------
export const priceSchema = z
  .number()
  .positive("Price must be greater than 0");

// ---------- URL ----------
export const urlSchema = 
   z.url({ message: "Invalid URL" })

o
// ---------- URL Array ----------
export const urlArraySchema = (message = "Please select at least one item") =>
  z.array(urlSchema).optional();

// ---------- Slug ----------
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

// ---------- Date (general - appointment date etc) ----------
export const dateSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), "Invalid date format");

// ---------- Time (appointment slot er jonno - HH:mm format) ----------
export const timeSchema = z
  .string()
  .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)");


 
