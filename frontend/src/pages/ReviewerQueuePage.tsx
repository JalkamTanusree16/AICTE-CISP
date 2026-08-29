import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShieldAlert, CheckCircle2, XCircle, MessageSquare, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReviewerQueuePage: React.FC = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await api.getReviewQueue();
      setQueue(data);
      if (data.length > 0) {
        selectSubmission(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectSubmission = async (sub: any) => {
    setSelectedSubmission(sub);
    try {
      const c = await api.getComments(sub.id);
      setComments(c);
    } catch (err) {
      setComments([]);
    }
  };

  const handleDecision = async (decision: string) => {
    if (!selectedSubmission) return;
    try {
      await api.submitReviewDecision(selectedSubmission.id, decision, decisionNotes);
      alert(`Review Decision recorded: ${decision}`);
      setDecisionNotes('');
      loadQueue();
    } catch (err: any) {
      alert(`Error recording decision: ${err.message}`);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedSubmission) return;
    try {
      await api.addComment(selectedSubmission.id, newComment);
      setNewComment('');
      const c = await api.getComments(selectedSubmission.id);
      setComments(c);
    } catch (err: any) {
      alert(`Error posting comment: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 text-black">
      {/* Title */}
      <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs flex justify-between items-center">
        <div>
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider">AICTE National Review Committee</div>
          <h2 className="text-xl font-black text-black tracking-tight">Institutional Submission Review Queue</h2>
          <p className="text-xs text-black font-extrabold">Statutory evaluation, change requests, and approval workflow for submitted curricula</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Queue List */}
        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-3">
          <h3 className="text-xs font-black text-black uppercase tracking-wider border-b-2 border-slate-300 pb-1">
            Pending Submissions ({queue.length})
          </h3>

          {loading ? (
            <div className="py-4 text-center text-xs font-black text-black">Loading review queue...</div>
          ) : queue.length === 0 ? (
            <div className="py-4 text-center text-xs font-black text-black">No submissions currently pending review.</div>
          ) : (
            <div className="space-y-2">
              {queue.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => selectSubmission(sub)}
                  className={`w-full text-left p-3 rounded border-2 text-xs transition-colors flex justify-between items-center cursor-pointer ${
                    selectedSubmission?.id === sub.id
                      ? 'bg-amber-100 border-amber-600 text-black font-black shadow-2xs'
                      : 'bg-slate-50 border-slate-400 hover:bg-slate-100 text-black font-extrabold'
                  }`}
                >
                  <div>
                    <div className="font-black text-sm text-black">{sub.university_name}</div>
                    <div className="text-[11px] text-black font-extrabold">{sub.program_name} ({sub.academic_year})</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-black text-sm">{sub.alignment_score}%</div>
                    <span className="text-[10px] bg-amber-200 text-black border border-amber-500 px-1.5 py-0.5 rounded font-black">{sub.status}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Review Details & Decision Panel */}
        <div className="bg-white p-5 rounded border-2 border-slate-400 shadow-2xs md:col-span-2 space-y-5">
          {selectedSubmission ? (
            <>
              <div className="border-b-2 border-slate-300 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-black">{selectedSubmission.university_name}</h3>
                  <div className="text-xs text-black font-black">
                    Program: <b className="text-black">{selectedSubmission.program_name}</b> • Academic Year: <b className="text-black">{selectedSubmission.academic_year}</b> (Version {selectedSubmission.version})
                  </div>
                  <div className="text-[11px] text-black font-black mt-0.5">Submitted at: {selectedSubmission.submitted_at || 'Recently'}</div>
                </div>

                <Link
                  to={`/comparison?uc_id=${selectedSubmission.id}`}
                  className="bg-amber-400 hover:bg-amber-500 text-black font-black text-xs px-3.5 py-2 rounded shadow-2xs inline-flex items-center space-x-1 border border-amber-600"
                >
                  <Eye className="w-4 h-4 font-bold text-black" />
                  <span>Inspect Full Semantic Matrix</span>
                </Link>
              </div>

              {/* Reviewer Action Buttons */}
              <div className="bg-slate-100 p-4 rounded border-2 border-slate-400 space-y-3 shadow-2xs">
                <h4 className="text-xs font-black text-black uppercase tracking-wider">
                  Review Committee Decision Actions:
                </h4>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Enter official reviewer notes / required change comments..."
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    className="w-full bg-white border-2 border-slate-500 rounded p-2 text-xs font-black text-black focus:outline-none focus:border-black placeholder:text-slate-700 shadow-2xs"
                  ></textarea>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleDecision('APPROVED')}
                    className="bg-emerald-300 hover:bg-emerald-400 text-black font-black text-xs px-4 py-2 rounded shadow-2xs inline-flex items-center space-x-1.5 border border-emerald-500 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-black font-bold" />
                    <span>Approve Curriculum</span>
                  </button>

                  <button
                    onClick={() => handleDecision('CHANGES_REQUESTED')}
                    className="bg-amber-400 hover:bg-amber-500 text-black font-black text-xs px-4 py-2 rounded shadow-2xs inline-flex items-center space-x-1.5 border border-amber-600 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4 text-black font-bold" />
                    <span>Request Changes (Send back to University)</span>
                  </button>

                  <button
                    onClick={() => handleDecision('REJECTED')}
                    className="bg-red-300 hover:bg-red-400 text-black font-black text-xs px-4 py-2 rounded shadow-2xs inline-flex items-center space-x-1.5 border border-red-500 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-black font-bold" />
                    <span>Reject Submission</span>
                  </button>
                </div>
              </div>

              {/* Comments Thread */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-black uppercase tracking-wider flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4 text-black font-bold" />
                  <span>Review Comments & Academic Discussion Thread ({comments.length})</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {comments.length === 0 ? (
                    <div className="text-xs text-black font-black italic">No comments recorded yet.</div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="bg-slate-100 p-3 rounded border-2 border-slate-400 text-xs space-y-1 shadow-2xs">
                        <div className="flex justify-between font-black text-black">
                          <span>{c.author_name}</span>
                          <span className="text-[11px] text-black font-extrabold">{c.created_at?.slice(0, 10)}</span>
                        </div>
                        <div className="text-black font-bold">{c.text}</div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add an inline review comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-white border-2 border-slate-500 rounded px-3 py-2 text-xs font-black text-black focus:outline-none placeholder:text-slate-700 shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="bg-amber-400 hover:bg-amber-500 text-black font-black text-xs px-4 py-2 rounded shadow-2xs border border-amber-600 cursor-pointer"
                  >
                    Post Comment
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-xs font-black text-black">Select a submission from the review queue.</div>
          )}
        </div>
      </div>
    </div>
  );
};
