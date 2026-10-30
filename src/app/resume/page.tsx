"use client";

import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { fetchFromAPI } from "@/services/api";
import { 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download,
  ExternalLink 
} from "lucide-react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resumeDetails, setResumeDetails] = useState<{ s3Url: string; resumeText: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current resume metadata if any exists
  useEffect(() => {
    async function loadResume() {
      try {
        const result = await fetchFromAPI("/resume");
        // Read data property safely
        setResumeDetails(result?.data || null);
      } catch (err: any) {
        const msg = err.message || "";
        // 404 is fine (profile doesn't exist yet) — just show empty state
        if (!msg.includes("404") && !msg.toLowerCase().includes("not found")) {
          setError(msg || "Failed to load current resume details");
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadResume();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // strip dataurl prefix: e.g. "data:application/pdf;base64,"
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF document.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatusMessage("Reading file and encoding to base64...");

    try {
      const base64Data = await convertToBase64(file);
      
      setStatusMessage("Uploading PDF to Amazon S3 & running AWS Textract OCR extraction (approx 5-15 seconds)...");
      const result = await fetchFromAPI("/resume/upload", {
        method: "POST",
        body: JSON.stringify({
          pdf: base64Data,
          fileName: file.name
        })
      });

      setStatusMessage("Analyzing text with Gemini AI, building career roadmap, and saving profile to DynamoDB...");
      setResumeDetails({
        s3Url: result?.data?.s3Url || "",
        resumeText: result?.data?.resumeText || "",
        name: result?.data?.name || "Unknown"
      });
      setStatusMessage("Success! Profile generated and securely saved.");
      setFile(null);
      setIsProcessing(false);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Resume upload and processing failed.");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-[#c5c6c7]/50 text-sm">Checking current resume details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Title */}
        <div className="border-b border-[#1f2833]/20 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-7 w-7 text-blue-400" />
            Resume Processing Hub
          </h1>
          <p className="text-sm text-[#c5c6c7]/65 mt-1">Upload a PDF resume to invoke the AWS extraction pipeline and rebuild your profile.</p>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 md:p-8">
              <h2 className="text-base font-semibold text-white mb-4">Upload New Resume</h2>
              
              <form onSubmit={handleUpload} className="space-y-6">
                {/* Drag-n-Drop box */}
                <div className="relative group border-2 border-dashed border-[#1f2833] hover:border-blue-500/50 rounded-xl p-8 text-center transition duration-150 bg-[#0b0c10]/40">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                  />
                  <FileUp className="h-10 w-10 text-gray-500 group-hover:text-blue-400 mx-auto mb-4 transition" />
                  <p className="text-sm font-semibold text-white">
                    {file ? file.name : "Select or drag PDF file here"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Accepts PDF format only (max 5MB)</p>
                </div>

                {error && (
                  <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-950/10 p-4 text-xs text-red-300">
                    <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-3 rounded-lg border border-blue-500/20 bg-blue-950/10 p-4">
                    <div className="flex items-center gap-3 text-xs text-blue-300">
                      <div className="h-4.5 w-4.5 animate-spin rounded-full border border-blue-400 border-t-transparent shrink-0"></div>
                      <p className="font-medium">{statusMessage}</p>
                    </div>
                    {/* Fake structural progression indicator */}
                    <div className="w-full bg-[#1f2833]/30 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full animate-[loading_10s_ease-in-out_infinite]" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!file || isProcessing}
                  className="w-full py-3.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-[#1f2833]/30 disabled:text-gray-500 disabled:cursor-not-allowed transition"
                >
                  Analyze Resume
                </button>
              </form>
            </div>
          </div>

          {/* Current Resume Metadata Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50">AWS Integration Details</h2>
              
              {resumeDetails ? (
                <div className="space-y-4 text-xs">
                  <div className="rounded-lg bg-[#0b0c10] border border-[#1f2833]/20 p-3 space-y-2">
                    <div className="flex items-center justify-between text-gray-500">
                      <span>Status</span>
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold uppercase tracking-wide text-[10px]">
                        <CheckCircle2 className="h-3 w-3" />
                        Parsed
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-500">
                      <span>Owner</span>
                      <span className="text-white font-medium truncate max-w-[120px]">{resumeDetails.name}</span>
                    </div>
                  </div>

                  <a
                    href={resumeDetails.s3Url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-[#c5c6c7] hover:text-white bg-[#1f2833]/30 hover:bg-[#1f2833]/60 border border-[#1f2833]/60 transition"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF from S3
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No resume has been uploaded yet. Upload a PDF to begin.</p>
              )}
            </div>
          </div>
        </div>

        {/* Current Resume Extracted Text Preview */}
        {resumeDetails && resumeDetails.resumeText && (
          <div className="rounded-xl border border-[#1f2833]/40 bg-[#0f111a] p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#c5c6c7]/50 mb-4 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-blue-400" />
              Extracted Raw Text (AWS Textract Output)
            </h2>
            <div className="max-h-[300px] overflow-y-auto rounded-lg border border-[#1f2833]/20 bg-[#0b0c10] p-4 text-xs font-mono text-gray-400/90 whitespace-pre-wrap leading-relaxed">
              {resumeDetails.resumeText}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
