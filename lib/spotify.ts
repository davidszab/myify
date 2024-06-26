import axios from "axios";

interface SpotifyToken {
  access: string;
  expiry: number;
  refresh: string;
}

async function refreshAccessToken(
  refreshToken: string
): Promise<SpotifyToken | null> {
  if (!refreshToken) return null;

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  const spotifyResp = await axios.post(
    "https://accounts.spotify.com/api/token",
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
      },
    }
  );
  const { data } = spotifyResp;
  const access = data.access_token;
  const expiry = Date.now() + data.expires_in * 1000;
  return { access, expiry, refresh: refreshToken };
}

function didAccessTokenExpire(token?: SpotifyToken) {
  if (!token) return true;
  return token.expiry <= Date.now();
}

interface User {
  name: string,
  imgURL: string
}

async function getUser(token: SpotifyToken): Promise<User | null> {
  if (!token || didAccessTokenExpire(token)) return null;

  const resp = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token.access}`,
    },
  });

  return { name: resp.data.display_name, imgURL: resp.data.images[0]?.url };
}

interface Artist {
  id: string;
  name: string;
  genres: string[];
  imageURL: string;
}

interface Track {
  id: string;
  artists: Array<{ name: string; id: string }>;
  title: string;
  album: { title: string; imageURL: string; id: string };
  previewURL: string;
}

enum TimeRange {
  ShortTerm = "short_term",
  MediumTerm = "medium_term",
  LongTerm = "long_term",
}

enum ItemType {
  Artists = "artists",
  Tracks = "tracks",
}

interface Options {
	timeRange?: TimeRange,
	number?: number
}

async function getTop(
  token: SpotifyToken,
  type: ItemType,
  options?: Options
) {
  if (!token || didAccessTokenExpire(token)) return null;

  const query = new URLSearchParams();
  if (options?.timeRange) query.append("time_range", options.timeRange);
  if (options?.number) query.append("limit", options.number.toString());

  const res = await axios.get(
    `https://api.spotify.com/v1/me/top/${type}?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token.access}`,
      },
    }
  );

  if (type == ItemType.Artists)
    return res.data.items.map((e: any): Artist => {
      return {
        id: e.id,
        name: e.name,
        genres: e.genres,
        imageURL: e.images[0].url,
      };
    });

  if (type == ItemType.Tracks)
    return res.data.items.map((e: any): Track => {
      return {
        id: e.id,
        title: e.name,
        artists: e.artists.map((f: any) => {
          return { name: f.name, id: f.id };
        }),
        previewURL: e.preview_url,
        album: {
          id: e.album.id,
          title: e.album_name,
          imageURL: e.album.images[0].url,
        },
      };
    });

	return null;
}

async function getTopArtists(token: SpotifyToken, options?: Options): Promise<Artist[] | null>{
	return getTop(token, ItemType.Artists, options);
}

async function getTopTracks(token: SpotifyToken, options?: Options): Promise<Track[] | null>{
	return getTop(token, ItemType.Tracks, options);
}

export {getTopArtists, getTopTracks, getUser, refreshAccessToken, didAccessTokenExpire, TimeRange, ItemType}
export type {SpotifyToken, Artist, Track, Options, User}