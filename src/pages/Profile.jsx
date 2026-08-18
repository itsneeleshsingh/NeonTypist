import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredStats, 
  resetAllStoredData, 
  computeRankTier 
} from '../utils/storage';
import { AvatarIcon } from '../components/Avatars';
import { AVATARS_LIST } from '../utils/avatarsData';
import { playKeyStrokeSound } from '../utils/sound';

export const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getStoredProfile());
  const [stats, setStats] = useState(getStoredStats());

  // Edit Mode state for user handle & bio
  const [isEditing, setIsEditing] = useState(false);
  const [editHandle, setEditHandle] = useState('');
  const [editBio, setEditBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('cyber_helmet');
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const loadedProfile = getStoredProfile();
    setProfile(loadedProfile);
    setEditHandle(loadedProfile.handle || '');
    setEditBio(loadedProfile.bio || '');
    setSelectedAvatar(loadedProfile.avatarId || 'cyber_helmet');
    setStats(getStoredStats());
  }, []);

  const handleStartEdit = () => {
    playKeyStrokeSound();
    setEditHandle(profile.handle || '');
    setEditBio(profile.bio || '');
    setSelectedAvatar(profile.avatarId || 'cyber_helmet');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    playKeyStrokeSound();
    setIsEditing(false);
    setEditHandle(profile.handle || '');
    setEditBio(profile.bio || '');
    setSelectedAvatar(profile.avatarId || 'cyber_helmet');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    playKeyStrokeSound();

    const sanitizedHandle = editHandle.trim() || 'Player';
    const sanitizedBio = editBio.trim() || 'Speed typist.';

    const updated = saveStoredProfile({
      handle: sanitizedHandle,
      bio: sanitizedBio,
      avatarId: selectedAvatar
    });

    setProfile(updated);
    setIsEditing(false);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleResetData = () => {
    playKeyStrokeSound();
    const result = resetAllStoredData();
    if (result) {
      setProfile(result.profile);
      setStats(result.stats);
      setEditHandle(result.profile.handle);
      setEditBio(result.profile.bio);
      setSelectedAvatar(result.profile.avatarId);
    }
    setShowResetConfirm(false);
  };

  const rank = computeRankTier(stats);
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.victories / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-7">
        
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              Player Profile
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                playKeyStrokeSound();
                navigate('/game');
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider hover:from-cyan-400 hover:to-teal-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)]"
            >
              Play Game
            </button>
          </div>
        </div>

        {/* Success Alert Feedback */}
        {saveFeedback && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 font-mono text-xs flex items-center gap-2">
            <span>✓</span> Profile changes saved successfully.
          </div>
        )}

        {/* IDENTITY CARD */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Avatar & Identifiers */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <AvatarIcon id={profile.avatarId} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl" />
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-slate-950 border border-slate-700 text-[9px] font-mono text-cyan-400 font-bold">
                  {rank.badge}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wide">
                    {profile.handle}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono border font-semibold ${rank.color}`}>
                    {rank.title}
                  </span>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            </div>

            {/* Edit Profile Toggle Button */}
            {!isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Edit Profile</span>
              </button>
            )}

          </div>

          {/* EDIT FORM (WHEN EDIT MODE IS ACTIVE) */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="pt-5 border-t border-slate-800 space-y-5 animate-fadeIn">
              
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-cyan-400">
                  Edit Details
                </h3>

                {/* Avatar Selection Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">
                    Choose Avatar:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {AVATARS_LIST.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          playKeyStrokeSound();
                          setSelectedAvatar(av.id);
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          selectedAvatar === av.id
                            ? 'border-cyan-400 bg-cyan-950/50 ring-1 ring-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                        }`}
                      >
                        <AvatarIcon id={av.id} className="w-8 h-8" />
                        <span className="text-[9px] font-mono text-slate-400 truncate w-full text-center">
                          {av.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Handle Input */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>Username / Handle:</span>
                    <span className="text-[10px] text-slate-400">{editHandle.length}/24</span>
                  </label>
                  <input
                    type="text"
                    maxLength={24}
                    value={editHandle}
                    onChange={(e) => setEditHandle(e.target.value)}
                    placeholder="e.g. NeonRunner"
                    className="w-full px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Bio Input */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>Bio / Status:</span>
                    <span className="text-[10px] text-slate-400">{editBio.length}/140</span>
                  </label>
                  <textarea
                    rows={2}
                    maxLength={140}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Short bio..."
                    className="w-full px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

              </div>

              {/* Edit Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase tracking-wider border border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>
          )}

        </div>

        {/* LIFETIME STATS METRICS GRID */}
        <div className="space-y-3">
          <h2 className="text-base font-mono font-bold uppercase text-white">
            Lifetime Stats
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Games</span>
              <p className="text-xl font-mono font-bold text-white mt-0.5">{stats.gamesPlayed}</p>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase">High Score</span>
              <p className="text-xl font-mono font-bold text-cyan-400 mt-0.5">{stats.highScore.toLocaleString()}</p>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Best WPM</span>
              <p className="text-xl font-mono font-bold text-purple-400 mt-0.5">{stats.bestWpm}</p>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Avg WPM</span>
              <p className="text-xl font-mono font-bold text-teal-400 mt-0.5">{stats.avgWpm}</p>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Acc</span>
              <p className="text-xl font-mono font-bold text-emerald-400 mt-0.5">{stats.avgAccuracy}%</p>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Max Streak</span>
              <p className="text-xl font-mono font-bold text-amber-400 mt-0.5">{stats.highestStreak}</p>
            </div>

          </div>
        </div>

        {/* MATCH HISTORY LOG */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3.5">
          
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase text-white">
              Recent Matches ({stats.recentMatches ? stats.recentMatches.length : 0})
            </h2>

            {stats.recentMatches && stats.recentMatches.length > 0 && (
              <span className="text-xs font-mono text-slate-400">
                Win Rate: <span className="text-emerald-400 font-bold">{winRate}%</span>
              </span>
            )}
          </div>

          {stats.recentMatches && stats.recentMatches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2 px-2.5">Date</th>
                    <th className="py-2 px-2.5">Outcome</th>
                    <th className="py-2 px-2.5">Difficulty</th>
                    <th className="py-2 px-2.5">Score</th>
                    <th className="py-2 px-2.5">WPM</th>
                    <th className="py-2 px-2.5">Accuracy</th>
                    <th className="py-2 px-2.5">Words</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {stats.recentMatches.map((match) => (
                    <tr key={match.id} className="hover:bg-slate-950/30 transition-colors">
                      <td className="py-2.5 px-2.5 text-slate-400 whitespace-nowrap">{match.date}</td>
                      <td className="py-2.5 px-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          match.outcome === 'Victory' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}>
                          {match.outcome}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 capitalize text-slate-300">{match.difficulty}</td>
                      <td className="py-2.5 px-2.5 font-bold text-cyan-400">{match.score.toLocaleString()}</td>
                      <td className="py-2.5 px-2.5 text-purple-300">{match.wpm} WPM</td>
                      <td className="py-2.5 px-2.5 text-emerald-400">{match.accuracy}%</td>
                      <td className="py-2.5 px-2.5 text-slate-400">{match.wordsTyped}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed border-slate-800/80 rounded-xl">
              <p className="text-slate-400 font-mono text-xs">No match records yet.</p>
            </div>
          )}

        </div>

        {/* SYSTEM ACTIONS & STORAGE RESET */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/60 text-xs font-mono text-slate-400">
          <span>
            Saved locally in browser (localStorage)
          </span>

          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => {
                playKeyStrokeSound();
                setShowResetConfirm(true);
              }}
              className="text-rose-400/80 hover:text-rose-400 hover:underline cursor-pointer"
            >
              Reset All Data
            </button>
          ) : (
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40">
              <span className="text-rose-300 text-[11px]">Confirm reset?</span>
              <button
                type="button"
                onClick={handleResetData}
                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-[10px] cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
