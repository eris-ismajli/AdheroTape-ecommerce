/*
  # Create dealer applications table

  1. New Tables
    - `dealer_applications`
      - `id` (uuid, primary key)
      - `company_name` (text) - Name of the company applying
      - `contact_name` (text) - Name of the contact person
      - `email` (text) - Contact email address
      - `phone` (text) - Contact phone number
      - `business_type` (text) - Type of business (retail/wholesale)
      - `message` (text) - Additional message from applicant
      - `created_at` (timestamptz) - Timestamp of application
  
  2. Security
    - Enable RLS on `dealer_applications` table
    - Add policy for inserting applications (public access for form submission)
    - Add policy for authenticated users to read applications (for admin review)
*/

CREATE TABLE IF NOT EXISTS dealer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_type text NOT NULL,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dealer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit dealer application"
  ON dealer_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view dealer applications"
  ON dealer_applications
  FOR SELECT
  TO authenticated
  USING (true);