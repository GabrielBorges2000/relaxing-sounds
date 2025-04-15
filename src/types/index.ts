// Sound mix type
export interface SoundMix {
  id: string
  name: string
  sounds: {
    id: string
    volume: number
  }[]
  createdAt: string
}

export interface Sound {
  id: string
  name: string
  source: any
  category: string
}