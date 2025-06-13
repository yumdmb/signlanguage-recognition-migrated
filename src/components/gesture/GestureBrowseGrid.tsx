'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GestureContribution } from '@/types/gestureContributions';
import { Play, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GestureBrowseGridProps {
  contributions: GestureContribution[];
  isLoading: boolean;
}

// Single gesture card component
function GestureCard({ contribution }: { contribution: GestureContribution }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-gray-100">
        {contribution.media_type === 'image' ? (
          <img
            src={contribution.media_url}
            alt={contribution.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <video
              src={contribution.media_url}
              className="w-full h-full object-cover"
              muted
              // Consider adding a poster attribute for videos if a thumbnail_url is available
              // poster={contribution.thumbnail_url}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <Play className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )}
        
        {/* Media type indicator */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black bg-opacity-70 text-white">
            {contribution.media_type === 'image' ? (
              <ImageIcon className="h-3 w-3 mr-1" />
            ) : (
              <Play className="h-3 w-3 mr-1" />
            )}
            {contribution.media_type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and language */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-2">{contribution.title}</h3>
            <Badge variant="outline" className="text-xs">
              {contribution.language}
            </Badge>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {contribution.description}
          </p>
          
          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              By {contribution.submitter?.name || 'Unknown'}
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{contribution.title}</DialogTitle>
                  <DialogDescription>{contribution.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Media */}
                  <div className="mt-4">
                    {contribution.media_type === 'image' ? (
                      <img
                        src={contribution.media_url}
                        alt={contribution.title}
                        className="w-full max-h-96 object-contain rounded-lg"
                      />
                    ) : (
                      <video
                        src={contribution.media_url}
                        controls
                        className="w-full max-h-96 rounded-lg"
                      />
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Language:</span> {contribution.language}
                    </div>
                    <div>
                      <span className="font-semibold">Contributed by:</span> {contribution.submitter?.name || 'Unknown User'}
                    </div>
                     <div>
                      <span className="font-semibold">Status:</span> <Badge variant={contribution.status === 'approved' ? 'default' : 'secondary'} className={contribution.status === 'approved' ? 'bg-green-500' : ''}>{contribution.status}</Badge>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="relative aspect-video bg-gray-200 animate-pulse"></div>
          <CardContent className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="text-center py-12">
      <ImageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Gestures Found</h3>
      <p className="text-muted-foreground">
        There are no community-contributed gestures available at the moment.
      </p>
    </div>
  );
}

export default function GestureBrowseGrid({ contributions, isLoading }: GestureBrowseGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  // As per requirements, browse gestures should only show approved ones.
  // This filtering should ideally happen at the data fetching layer (hook/service).
  // However, adding a client-side filter here as a safeguard or if props aren't pre-filtered.
  const approvedContributions = contributions.filter(c => c.status === 'approved');

  if (approvedContributions.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {approvedContributions.map((contribution) => (
        <GestureCard key={contribution.id} contribution={contribution} />
      ))}
    </div>
  );
}
