import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, BookOpen } from "lucide-react"

interface BookCardProps {
  book: {
    id: number
    title: string
    author: string
    image: string
    rating: number
    genre: string
    available: boolean
    availableCopies: number
  }
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/libro/${book.id}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 h-full">
        <CardContent className="p-4">
          <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg bg-muted">
            <Image
              src={book.image || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {!book.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">No Disponible</Badge>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{book.rating}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {book.genre}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{book.availableCopies} disponibles</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
