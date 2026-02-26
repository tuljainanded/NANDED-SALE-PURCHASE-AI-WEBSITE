"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Users, FileText, Clock, CheckCircle, XCircle, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user as any)?.role !== "admin") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/posts")
      ]);
      const statsData = await statsRes.json();
      const postsData = await postsRes.json();

      setStats(statsData);
      setPosts(postsData.posts || []);
    } catch (error) {
      console.error("Fetch Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert(`Post ${newStatus} successfully! Email sent to user.`);
        fetchData();
      }
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleFeaturedToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentStatus }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      alert("Error updating featured status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post permanently?")) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      alert("Error deleting post");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-red-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard title="Total Users" value={stats?.totalUsers} icon={<Users className="h-6 w-6 text-blue-600" />} color="bg-blue-100" />
          <StatCard title="Total Ads" value={stats?.totalPosts} icon={<FileText className="h-6 w-6 text-purple-600" />} color="bg-purple-100" />
          <StatCard title="Pending" value={stats?.pendingPosts} icon={<Clock className="h-6 w-6 text-yellow-600" />} color="bg-yellow-100" />
          <StatCard title="Approved" value={stats?.approvedPosts} icon={<CheckCircle className="h-6 w-6 text-red-600" />} color="bg-red-100" />
          <StatCard title="Rejected" value={stats?.rejectedPosts} icon={<XCircle className="h-6 w-6 text-red-600" />} color="bg-red-100" />
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg leading-6 font-bold text-gray-900">Manage Posts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category / Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 max-w-xs truncate" title={post.title}>
                        <Link href={`/posts/${post._id}`} target="_blank" className="hover:text-red-600 hover:underline">
                          {post.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">{post.user?.email}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(post.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{post.category}</div>
                      <div className="text-sm text-red-600 font-bold">{formatCurrency(post.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${post.status === 'Approved' ? 'bg-red-100 text-red-800' :
                          post.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleFeaturedToggle(post._id, post.featured)} className={`p-2 rounded-full transition-colors ${post.featured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-300 hover:text-yellow-500 hover:bg-gray-50'}`}>
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {post.status !== "Approved" && (
                          <Button size="sm" onClick={() => handleStatusChange(post._id, "Approved")} className="bg-red-600 hover:bg-red-700">Approve</Button>
                        )}
                        {post.status !== "Rejected" && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(post._id, "Rejected")} className="text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(post._id)} className="text-gray-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}
