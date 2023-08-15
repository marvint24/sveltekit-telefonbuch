import entityParser from "$lib/shared/entityParser.ts"
import type { PageLoad } from "./$types.ts"
import { PUBLIC_MEILI_SEARCH_KEY } from "$env/static/public"
import { browser } from "$app/environment"

export const load: PageLoad = async (event) => {
  console.log("search load function triggered")
  let searchText = event.url.searchParams.get("q")
  if (searchText) {
    searchText = searchText.replace(/[/?=]|\s\s/g, "")
    let searchUrl = browser
      ? "https://kontaktverzeichnis.gnh.net/indexes/entities/search/"
      : "http://meilisearch:7700/indexes/entities/search/"
    const response = await event.fetch(searchUrl, {
      method: "POST",
      body: JSON.stringify({ q: searchText, limit: 50 }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PUBLIC_MEILI_SEARCH_KEY}`,
      },
    })

    let res = await response.json()
    let persons: any = []
    let ressources: any = []
    res.hits.forEach((obj: any) => {
      let type = obj.id[0]
      obj.id = obj.id.slice(2)
      if (type === "p") {
        obj.type = "person"
        persons.push(obj)
      } else if (type === "r") {
        obj.type = "ressource"
        ressources.push(obj)
      }
    })

    let searchResult = entityParser(persons, ressources)

    return {
      searchResult: searchResult,
    }
  } else {
    return {}
  }
}
