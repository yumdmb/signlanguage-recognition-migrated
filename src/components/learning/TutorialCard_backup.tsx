// 'use client'

// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { BookOpen, Edit, Trash } from 'lucide-react';
// import { TutorialWithProgress } from '@/types/database';
// import YouTubeVideoPreview from './YouTubeVideoPreview';

// interface TutorialCardProps {
//   tutorial: TutorialWithProgress;
//   isAdmin: boolean;
//   onEdit: (tutorial: TutorialWithProgress) => void;
//   onDelete: (id: string) => void;
// }

// const TutorialCard: React.FC<TutorialCardProps> = ({
//   tutorial,
//   isAdmin,
//   onEdit,
//   onDelete
// }) => {
//   const [showVideo, setShowVideo] = useState(false);
//   const videoId = extractVideoId(tutorial.video_url);

//   const openYouTubeVideo = () => {
//     if (tutorial.video_url) {
//       window.open(tutorial.video_url, '_blank');
//     }
//   };

//   return (
//     <Card className="overflow-hidden">
//       <div className="relative">
//         {showVideo && videoId ? (
//           // YouTube embed iframe
//           <div className="w-full h-48">
//             <iframe
//               width="100%"
//               height="100%"
//               src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
//               title={tutorial.title}
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               className="rounded-t-lg"
//             />
//           </div>
//         ) : (
//           <>
//             <img 
//               src={tutorial.thumbnail_url || 'https://placehold.co/400x225?text=Tutorial'} 
//               alt={tutorial.title} 
//               className="w-full h-48 object-cover" 
//             />
//             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//               <div className="flex gap-2">
//                 <button 
//                   className="bg-primary text-white p-3 rounded-full hover:bg-primary/80"
//                   onClick={() => setShowVideo(true)}
//                   title="Play video"
//                 >
//                   <Play className="h-6 w-6" />
//                 </button>
//                 <button 
//                   className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700"
//                   onClick={openYouTubeVideo}
//                   title="Open in YouTube"
//                 >
//                   <ExternalLink className="h-6 w-6" />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
        
//         <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 m-2 rounded">
//           {tutorial.duration}
//         </div>
//         <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 m-2 rounded capitalize">
//           {tutorial.level}
//         </div>
//           {/* Auto-detected badge */}
//         {tutorial.thumbnail_url && tutorial.thumbnail_url.includes('img.youtube.com') && (
//           <div className="absolute top-0 right-0 bg-green-600 text-white text-xs px-2 py-1 m-2 rounded">
//             📺 Auto-detected
//           </div>
//         )}
//       </div>
//       <CardHeader className="pb-2">
//         <CardTitle className="text-lg flex items-center">
//           <BookOpen className="h-4 w-4 mr-2" /> {tutorial.title}
//         </CardTitle>
//         <CardDescription>{tutorial.description}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-2">
//           <div className="flex justify-between text-xs">
//             <span>Progress</span>
//             <span>{tutorial.progress || 0}%</span>
//           </div>
//           <Progress value={tutorial.progress || 0} className="h-2" />
//         </div>
//       </CardContent>
//       {isAdmin && (
//         <CardFooter className="flex justify-end space-x-2 pt-0">
//           <Button variant="outline" size="sm" onClick={() => onEdit(tutorial)}>
//             <Edit className="h-4 w-4 mr-2" /> Edit
//           </Button>
//           <Button variant="destructive" size="sm" onClick={() => onDelete(tutorial.id)}>
//             <Trash className="h-4 w-4 mr-2" /> Delete
//           </Button>
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// export default TutorialCard;
