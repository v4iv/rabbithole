export interface BioDiscipline {
  key: string
  title: string
  description: string
}

export interface BioStat {
  label: string
  val: string
}

export interface BioFrontmatter {
  name: string
  role: string
  image: string
  location: string
  coordinates?: string
  profileTag: string
  quote: string
  manifestoTitle?: string
  manifestoTag?: string
  manifestoText?: string
  imageCaptionRole: string
  imageCaptionLocation: string
  statementHeading: string
  statementParagraph1: string
  statementParagraph2: string
  statementQuote: string
  instagramHandle: string
  instagramUrl: string
  stats?: BioStat[]
  disciplines: BioDiscipline[]
}
