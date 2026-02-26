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
  const [listings, setListings] = useState<any[]>([]);
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
      const [statsRes, listingsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/listings")
      ]);
      const statsData = await statsRes.json();
      const listingsData = await listingsRes.json();
      
      setStats(statsData);
      setListings(listingsData.listings || []);
    } catch (error) {
      console.error("Fetch Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert(`Listing ${newStatus} successfully! Email sent to user.`);
        fetchData();
      }
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleFeaturedToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
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
    if (!confirm("Are you sure you want to delete this listing permanently?")) return;
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      alert("Error deleting listing");
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
          <StatCard title="Total Ads" value={stats?.totalListings} icon={<FileText className="h-6 w-6 text-purple-600" />} color="bg-purple-100" />
          <StatCard title="Pending" value={stats?.pendingListings} icon={<Clock className="h-6 w-6 text-yellow-600" />} color="bg-yellow-100" />
          <StatCard title="Approved" value={stats?.approvedListings} icon={<CheckCircle className="h-6 w-6 text-red-600" />} color="bg-red-100" />
          <StatCard title="Rejected" value={stats?.rejectedListings} icon={<XCircle className="h-6 w-6 text-red-600" />} color="bg-red-100" />
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg leading-6 font-bold text-gray-900">Manage Listings</h3>
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
                {listings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 max-w-xs truncate" title={listing.title}>
                        <Link href={`/listings/${listing._id}`} target="_blank" className="hover:text-red-600 hover:underline">
                          {listing.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">{listing.user?.email}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(listing.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{listing.category}</div>
                      <div className="text-sm text-red-600 font-bold">{formatCurrency(listing.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${listing.status === 'Approved' ? 'bg-red-100 text-red-800' : 
                          listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleFeaturedToggle(listing._id, listing.featured)} className={`p-2 rounded-full transition-colors ${listing.featured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-300 hover:text-yellow-500 hover:bg-gray-50'}`}>
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {listing.status !== "Approved" && (
                          <Button size="sm" onClick={() => handleStatusChange(listing._id, "Approved")} className="bg-red-600 hover:bg-red-700">Approve</Button>
                        )}
                        {listing.status !== "Rejected" && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(listing._id, "Rejected")} className="text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(listing._id)} className="text-gray-500 hover:text-red-700 hover:bg-red-50">
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

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) {
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
