export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  isPublished: boolean;
  thumbnail: string | null;
  categoryId: string | null;
  category?: { id: string; name: string } | null;
  _count: { lessons: number; enrollments: number };
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;
  position: number;
  isFree: boolean;
}
