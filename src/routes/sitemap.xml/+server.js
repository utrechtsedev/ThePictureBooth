// /src/routes/sitemap.xml/+server.js
import * as sitemap from 'super-sitemap';
export const prerender = true;
export const GET = async () => {
  return await sitemap.response({
    origin: 'https://thepicturebooth.nl',
  });
};
