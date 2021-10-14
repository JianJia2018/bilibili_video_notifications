import { getTags } from "./api.js"
let pn = 1
let tags = []

/**
 * 
 * @returns 递归拿tag
 */
const getAllTags = async () => {
  let { data } = await getTags(pn)
  if (data.length > 0) {
    tags = [...tags, ...data]
    pn++
    return getAllTags()
  } else {
    return tags.map(x => x.mid)
  }
}

export { getAllTags }
