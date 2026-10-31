export interface BioDiscipline {
  key: string
  title: string
  description: string
}

export interface BioFrontmatter {
  name: string
  role: string
  image: string
  location: string
  profileTag: string
  quote: string
  imageCaptionRole: string
  imageCaptionLocation: string
  statementHeading: string
  statementParagraph1: string
  statementParagraph2: string
  statementQuote: string
  instagramHandle: string
  instagramUrl: string
  disciplines: BioDiscipline[]
}
