// this will be the component when you click on a project

interface props {
  id: number,
  title: string,
  coverImage: string,
  description: string, // short description
  overview: string, // in depth overview
  skills: string[],
  features: string[], // format strings like "feature; description"
  carousell?: string[], // images that will rotate through a carousell
  link?: string[], // index 0 is text, 1 is href
}

export default function Project(){

}