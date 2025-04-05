import {parse} from "cookie";
import {cookies} from "next/headers";

export const setCookies = async (authCookies: string[] | undefined) => {
    'use server'
    if (authCookies && authCookies.length > 0) {
        const cookieStore = await cookies();
        authCookies.forEach(cookie => {
            const parsedCookie = parse(cookie)
            const [cookieName, cookieValue] = Object.entries(parsedCookie)[0]

            cookieStore.set({
                name: cookieName,
                value: cookieValue,
                httpOnly: true,
                maxAge: parseInt(parsedCookie["Max-Age"]),
                path: parsedCookie.path,
                sameSite: 'lax',
                expires: new Date(parsedCookie.expires),
                secure: true,
            })
        })
    }
}
