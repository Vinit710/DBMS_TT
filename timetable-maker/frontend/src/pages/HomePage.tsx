import { Button } from "../components/ui/button"
import { Calendar } from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  const yearGroups = [
    { name: "Second Year A", route: "sya" },
    { name: "Second Year B", route: "syb" },
    { name: "Third Year A", route: "tya/teachers" },
    { name: "Third Year B", route: "tyb" },
    { name: "Fourth Year A", route: "fya" },
    { name: "Fourth Year B", route: "fyb" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Time Table Maker</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {yearGroups.map((group) => (
            <Link key={group.route} to={`/${group.route}`}>
              <Button
                className="h-24 text-lg font-semibold w-full"
                variant="outline"
              >
                <Calendar className="mr-2 h-6 w-6" />
                {group.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}