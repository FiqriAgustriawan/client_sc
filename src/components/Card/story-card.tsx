import Image from "next/image"

interface StoryCardProps {
  avatarUrl: string
  name: string
  story: string
}

export function StoryCard({ avatarUrl, name, story }: StoryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 max-w-[300px]">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src={avatarUrl || "/placeholder.svg"}
          alt={`${name}'s avatar`}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-sm font-medium text-gray-900">{name}</span>
      </div>
      <div className="relative">
        <span className="absolute -left-2 top-0 text-4xl text-gray-300"></span>
        <p className="pl-4 text-sm text-gray-600 leading-relaxed">{story}</p>
      </div>
    </div>
  )
}

