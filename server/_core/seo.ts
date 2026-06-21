import { restaurants, recipes } from "../../client/src/lib/data";
import { getUserRecipeBySlug } from "../db";

const defaultMeta = {
    title: "Bezmasá Jídla — Veganské a Vegetariánské Restaurace v Praze",
    description: "Největší český průvodce veganskými a vegetariánskými restauracemi v Praze. Najdi nejlepší bezmasá jídla, přečti recenze a objevuj nové recepty.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/logo-variant-a-dJFXR9MBPW8QsrZquQfzwN.png"
};

export async function injectMetaTags(html: string, url: string): Promise<string> {
    let title = defaultMeta.title;
    let description = defaultMeta.description;
    let image = defaultMeta.image;

    try {
        // Basic router logic for meta tags parsing
        if (url.startsWith("/restaurace/")) {
            const slug = url.split("/")[2]?.split("?")[0];
            if (slug) {
                const item = restaurants.find((r) => r.slug === slug);
                if (item) {
                    title = `${item.name} | Bezmasá Jídla`;
                    description = item.description;
                    image = item.image;
                }
            }
        } else if (url.startsWith("/recepty/")) {
            const slug = url.split("/")[2]?.split("?")[0];
            if (slug) {
                let item = recipes.find((r) => r.slug === slug);
                if (item) {
                    title = `${item.title} | Bezmasé Recepty`;
                    description = item.description;
                    image = item.image;
                } else {
                    // Check DB for user recipe
                    const userRecipe = await getUserRecipeBySlug(slug);
                    if (userRecipe && userRecipe.isApproved) {
                        title = `${userRecipe.title} | Bezmasé Recepty`;
                        description = userRecipe.description || "";
                        image = userRecipe.image || image;
                    }
                }
            } else {
                // Just /recepty endpoint
                const searchParams = new URL(url, "http://localhost").searchParams;
                const category = searchParams.get("category");
                if (category) {
                    title = `Veganská a Vegetariánská ${category} | Bezmasé Recepty`;
                } else {
                    title = "Bezmasé Recepty — Veganské a Vegetariánské Recepty";
                }
            }
        }

        // Replace <title>
        html = html.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);

        // Replace meta tags
        html = html.replace(/<meta name="description" content="[^"]*"/gi, `<meta name="description" content="${description.replace(/"/g, '&quot;')}"`);
        html = html.replace(/<meta property="og:title" content="[^"]*"/gi, `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}"`);
        html = html.replace(/<meta property="og:description" content="[^"]*"/gi, `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}"`);
        html = html.replace(/<meta property="og:image" content="[^"]*"/gi, `<meta property="og:image" content="${image.replace(/"/g, '&quot;')}"`);

        html = html.replace(/<meta name="twitter:title" content="[^"]*"/gi, `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}"`);
        html = html.replace(/<meta name="twitter:description" content="[^"]*"/gi, `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}"`);
        html = html.replace(/<meta name="twitter:image" content="[^"]*"/gi, `<meta name="twitter:image" content="${image.replace(/"/g, '&quot;')}"`);

    } catch (err) {
        console.error("[SEO Injection Error]", err);
    }

    return html;
}
