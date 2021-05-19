import sanityClient from '@sanity/client';

export default sanityClient({
    projectId: "mo5luaek",
    dataset: "production",
    useCdn: true
})