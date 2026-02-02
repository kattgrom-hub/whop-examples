import Link from "next/link";
import { mockCourses } from "@/lib/courses-data";

export default function CoursesPage() {
  const publishedCourses = mockCourses.filter((c) => c.status === "published");
  const draftCourses = mockCourses.filter((c) => c.status === "draft");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Students</p>
          <p className="text-3xl font-bold">
            {mockCourses.reduce((sum, c) => sum + c.students, 0)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Published Courses</p>
          <p className="text-3xl font-bold">{publishedCourses.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Course Revenue</p>
          <p className="text-3xl font-bold text-green-500">$4,521</p>
        </div>
      </div>

      {/* Published Courses */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Published</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publishedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{course.title}</h3>
                  <span className="text-green-500 font-semibold">${course.price}</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.lessons} lessons · {course.duration}</span>
                  <span>{course.students} students</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Draft Courses */}
      {draftCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Drafts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draftCourses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-800 rounded-xl border border-gray-700 border-dashed overflow-hidden opacity-75"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
                      Draft
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{course.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{course.lessons} lessons · {course.duration}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Continue Editing
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Whop Courses Integration Note */}
      <div className="p-4 border border-dashed border-gray-700 rounded-xl text-center text-gray-500">
        <p>Whop Courses API will power course creation, lessons, and student progress tracking</p>
      </div>
    </div>
  );
}
