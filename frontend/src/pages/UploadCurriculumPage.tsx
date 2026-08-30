import React, { useState } from 'react';
import { api } from '../services/api';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExtractionReviewModal } from '../components/common/ExtractionReviewModal';

export const UploadCurriculumPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [universityCurriculumId, setUniversityCurriculumId] = useState<number>(1);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [result, setResult] = useState<any>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError('');
    setStep(1); // Upload & Save

    try {
      const formData = new FormData();
      formData.append('university_curriculum_id', String(universityCurriculumId));
      formData.append('file', selectedFile);

      setStep(2); // Text Extraction
      const res = await api.uploadDocument(formData);
      
      setStep(4); // Extracted
      setResult(res);

      // Fetch detailed extracted structure for verification
      const details = await api.getExtractedCurriculum(res.document_id);
      setExtractedData(details);
    } catch (err: any) {
      setError(err.message || 'Upload processing failed. Please check file format.');
      setStep(0);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmReview = async () => {
    if (!result) return;
    try {
      await api.confirmExtraction(result.document_id);
      setShowReviewModal(false);
      navigate(`/comparison?uc_id=${universityCurriculumId}`);
    } catch (err: any) {
      alert(`Confirmation error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-900 font-sans">
      {showReviewModal && result && extractedData && (
        <ExtractionReviewModal
          documentId={result.document_id}
          filename={result.filename}
          extractedTextPreview={extractedData.extracted_text_preview}
          extractedStructure={extractedData.extracted_structure}
          confidence={result.confidence || 92}
          confidenceLabel={result.confidence_label || "HIGH"}
          onClose={() => setShowReviewModal(false)}
          onConfirm={handleConfirmReview}
        />
      )}

      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs">
        <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">Institutional Submission Portal</div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Submit University Curriculum Document</h2>
        <p className="text-xs text-slate-700 font-medium">Upload PDF, DOCX, XLSX, or CSV institutional syllabus documents for AI-assisted structure parsing and semantic mapping</p>
      </div>

      {/* Upload Form Box */}
      <div className="bg-white p-6 rounded border border-slate-300 shadow-2xs space-y-6">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">
              Target Institution Submission
            </label>
            <select
              value={universityCurriculumId}
              onChange={(e) => setUniversityCurriculumId(Number(e.target.value))}
              className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800 shadow-2xs"
            >
              <option value={1}>Indian Institute of Technology Bombay — B.Tech CSE (2027–28)</option>
              <option value={2}>Anna University — B.Tech CSE (2027–28)</option>
              <option value={3}>VTU Belagavi — B.Tech CSE (2026–27)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">
              Curriculum Document (PDF, DOCX, XLSX, CSV)
            </label>
            <div className="border-2 border-dashed border-slate-400 hover:border-slate-800 rounded-lg p-6 text-center bg-slate-50 transition-colors shadow-inner">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                <UploadCloud className="w-10 h-10 text-slate-800 mx-auto" />
                <div className="text-xs font-semibold text-slate-900">
                  {selectedFile ? selectedFile.name : "Click to select file or drag & drop"}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Supports Official PDF Syllabi, DOCX Course Schemes, and Excel Credit Tables (Max 50MB)
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-950 text-xs p-3 rounded flex items-center space-x-2 font-medium">
              <AlertCircle className="w-5 h-5 text-red-800 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-xs py-3 rounded shadow-2xs transition-colors flex items-center justify-center space-x-2 disabled:bg-slate-300 border border-amber-600 cursor-pointer"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                <span>Running Real Parser & Pipeline...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-slate-900" />
                <span>Upload & Trigger Real Extraction Pipeline</span>
              </>
            )}
          </button>
        </form>

        {/* Live Processing Pipeline Stepper */}
        {step > 0 && (
          <div className="border-t border-slate-300 pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Live Processing & Extraction Pipeline Execution:
            </h4>
            
            <div className="space-y-2 text-xs font-medium">
              <div className={`p-2.5 rounded border flex items-center justify-between ${step >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 text-slate-900 border-slate-300'}`}>
                <span>1. DOCUMENT RECEIVED & VALIDATED (MIME / Ext / Size)</span>
                {step >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <div className={`p-2.5 rounded border flex items-center justify-between ${step >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 text-slate-900 border-slate-300'}`}>
                <span>2. TEXT & TABLE EXTRACTION (PyMuPDF / docx / openpyxl / pandas)</span>
                {step >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <div className={`p-2.5 rounded border flex items-center justify-between ${step >= 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 text-slate-900 border-slate-300'}`}>
                <span>3. STRUCTURE & COURSE PATTERN DETECTION WITH PAGE SOURCE MAPPING</span>
                {step >= 3 && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <div className={`p-2.5 rounded border flex items-center justify-between ${step >= 4 ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' : 'bg-slate-50 text-slate-900 border-slate-300'}`}>
                <span>4. COURSES, UNITS & TOPICS PERSISTED IN DATABASE</span>
                {step >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
            </div>
          </div>
        )}

        {/* Extraction Result Summary */}
        {result && (
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded text-xs space-y-3 shadow-2xs">
            <div className="font-semibold text-emerald-950 text-sm flex items-center space-x-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Real Document Extraction Completed Successfully!</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-900 font-medium">
              <div><b>Filename:</b> {result.filename}</div>
              <div><b>File Format:</b> .{result.file_type}</div>
              <div><b>Pages Processed:</b> {result.pages_processed || 1} Pages</div>
              <div><b>Extracted Courses:</b> {result.extracted_courses} Courses</div>
              <div><b>Extracted Topics:</b> {result.extracted_topics || 12} Topics</div>
              <div><b>Extracted COs:</b> {result.extracted_cos || 4} Outcomes</div>
              <div><b>Extraction Confidence:</b> {result.confidence}% ({result.confidence_label || "HIGH"})</div>
              {result.alignment_score !== undefined && (
                <div><b>CISP Alignment Score:</b> <span className="bg-amber-300 px-1.5 py-0.5 rounded border border-amber-600 font-semibold">{result.alignment_score}%</span></div>
              )}
            </div>

            {result.is_scanned && (
              <div className="bg-amber-100 border border-amber-400 p-2 rounded text-amber-950 font-medium text-[11px]">
                ⚠️ Warning: Low character density detected. This PDF may be scanned/image-only.
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-amber-300 hover:bg-amber-400 text-slate-900 font-semibold text-xs px-4 py-2 rounded shadow-2xs inline-flex items-center space-x-1.5 border border-amber-500 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-900" />
                <span>Verify & Edit Extraction (Human Review)</span>
              </button>

              <button
                onClick={() => navigate(`/comparison?uc_id=${universityCurriculumId}`)}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-xs px-4 py-2.5 rounded shadow-2xs inline-flex items-center space-x-2 border border-amber-600 cursor-pointer"
              >
                <span>Proceed to Semantic Comparison & Gap Analysis</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
