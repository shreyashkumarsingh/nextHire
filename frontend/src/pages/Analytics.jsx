import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Award, Target } from 'lucide-react';
import { resumeAPI } from '../services/api';

const Analytics = () => {
  const [scoreData, setScoreData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [summaryCards, setSummaryCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch resumes data
        const resumesData = await resumeAPI.getAllResumes();
        const resumes = Array.isArray(resumesData) ? resumesData : (resumesData.resumes || [resumesData]);

        // Process score data
        const scores = resumes.map(resume => ({
          name: resume.name,
          score: resume.score || 0
        }));
        setScoreData(scores);

        // Process skills data
        const skillsMap = {};
        resumes.forEach(resume => {
          if (Array.isArray(resume.skills)) {
            resume.skills.forEach(skill => {
              const skillName = typeof skill === 'string' ? skill : skill.name;
              skillsMap[skillName] = (skillsMap[skillName] || 0) + 1;
            });
          }
        });

        const skills = Object.entries(skillsMap)
          .map(([name, count]) => ({ name, value: count }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);
        setSkillsData(skills);

        // Calculate summary
        const avgScore = resumes.length ? Math.round(resumes.reduce((sum, r) => sum + (r.score || 0), 0) / resumes.length) : 0;
        const avgMatch = resumes.length ? Math.round(resumes.reduce((sum, r) => sum + (r.matchPercentage || 0), 0) / resumes.length) : 0;
        const topSkill = skills.length ? skills[0].name : 'N/A';

        const cards = [
          {
            label: 'Total Resumes',
            value: resumes.length.toString(),
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            label: 'Average Score',
            value: avgScore.toString(),
            icon: Award,
            color: 'bg-green-500'
          },
          {
            label: 'Top Skill',
            value: topSkill,
            subtext: skills.length ? `${skills[0].value} mentions` : 'N/A',
            icon: Target,
            color: 'bg-purple-500'
          },
          {
            label: 'Avg Match',
            value: `${avgMatch}%`,
            icon: TrendingUp,
            color: 'bg-orange-500'
          }
        ];
        setSummaryCards(cards);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
        // Set default data on error
        setScoreData([]);
        setSkillsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section - Analytics & Insights Focus */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-800 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Analytics & Insights</h1>
        <p className="text-purple-100">
          Deep dive into resume metrics, skills distribution, and candidate performance
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading analytics...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Summary Cards - Larger & More Prominent */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, index) => (
              <div key={index} className="card p-6 border-l-4" style={{borderLeftColor: card.color.replace('bg-', '#')}}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-semibold tracking-wide">{card.label}</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                {card.subtext && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                    {card.subtext}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Main Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bar Chart - Resume Scores */}
            <div className="card p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Score Distribution
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Resume quality scores across all candidates</p>
              </div>
              {scoreData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis tick={{ fill: '#9ca3af' }} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '0.75rem',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>

            {/* Pie Chart - Skills Distribution */}
            <div className="card p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Skills Distribution
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Top skills found across all resumes</p>
              </div>
              {skillsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={skillsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {skillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '0.75rem',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Top Skills Detailed Breakdown */}
          <div className="card p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Skills Detailed Breakdown
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Candidate exposure to each skill</p>
            </div>
            {skillsData.length > 0 ? (
              <div className="space-y-6">
                {skillsData.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">{skill.name}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Found in resumes</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{skill.value}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">candidate{skill.value !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(skill.value / (Math.max(...skillsData.map(s => s.value), 1))) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No skill data available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
