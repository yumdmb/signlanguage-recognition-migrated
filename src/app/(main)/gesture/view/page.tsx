'use client'

import React, { useEffect, useCallback } from 'react'; // Added useCallback
import { Toaster } from "@/components/ui/sonner";
import GestureViewHeader from '@/components/gesture/GestureViewHeader';
import GestureViewLoadingState from '@/components/gesture/GestureViewLoadingState';
import GestureViewEmptyState from '@/components/gesture/GestureViewEmptyState';
import GestureContributionsTable from '@/components/gesture/GestureContributionsTable';
import GestureFilters from '@/components/gesture/GestureFilters';
import { useGestureContributions } from '@/hooks/useGestureContributions';
import { useAuth } from '@/context/AuthContext';
import { GestureContributionFilters } from '@/types/gestureContributions';

export default function GestureView() {
  const { currentUser } = useAuth();
  
  // Initialize filters: by default, no status filter, will be set to user's submissions.
  const {
    contributions,
    isLoading,
    userRole,
    handleApprove,
    handleReject,
    handleDelete,
    refreshContributions,
    updateFilters, // Use this to set filters
    filters // Current filters from the hook
  } = useGestureContributions({}); // Initialize with empty filters object

  useEffect(() => {
    if (currentUser) {
      // Set filter to current user's submissions
      // No specific status filter here, so user sees all their own (pending, approved, rejected)
      updateFilters({ submitted_by: currentUser.id, status: 'all' }); 
    }
  }, [currentUser, updateFilters]);

  const handleFilterChange = useCallback((newFilters: GestureContributionFilters) => {
    // Ensure submitted_by filter is maintained if current user is set
    if (currentUser) {
      updateFilters({ ...newFilters, submitted_by: currentUser.id });
    } else {
      updateFilters(newFilters);
    }
  }, [currentUser, updateFilters]); // Dependencies for handleFilterChange

  if (!currentUser && !isLoading) {
    return (
      <div className="container py-6 text-center">
        <p>Please log in to view your contributions.</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Toaster />
      <GestureViewHeader userRole={userRole} />

      <div className="space-y-6">
        <GestureFilters 
          filters={filters || { submitted_by: currentUser?.id, status: 'all'}}
          onFiltersChange={handleFilterChange} // handleFilterChange is now memoized
          userRole={userRole}
          // Show status filter for admins or if explicitly needed for users to filter their own by status.
          // For now, let's enable it for admins viewing their own, or for users to filter their own.
          showStatusFilter={true} 
        />

        {isLoading ? (
          <GestureViewLoadingState />
        ) : contributions.length > 0 ? (
          <GestureContributionsTable
            contributions={contributions}
            userRole={userRole}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete} // Users can delete their own (pending/rejected), Admins can delete any
            onRefresh={refreshContributions}
            isMySubmissionsView={true} // Indicate this is the "My Submissions" context
          />
        ) : (
          <GestureViewEmptyState isMySubmissions={true} />
        )}
      </div>
    </div>
  );
}
