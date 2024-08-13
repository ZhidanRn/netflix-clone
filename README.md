# Netflix Clone

This is a Netflix clone web application built with Next.js, Prisma, and NextAuth. The project replicates key features of Netflix, providing users with a seamless streaming experience, including user authentication, content browsing, and personalized recommendations.

## Getting Started

This project was bootstrapped with [create-next-app](https://nextjs.org/docs/app/building-your-application/creating-a-new-application).

### Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Key Features

- **User Authentication:** Implement user registration, login, and session management using NextAuth with support for multiple authentication providers like Google, GitHub, and Email.
- **Movie and TV Show Listings:** Display a wide selection of movies and TV shows, fetched from a locally seeded file (`/app/seed/page.tsx`), including cover images, titles, genres, release dates, age ratings, and runtime.
- **Detailed Content View:** Allow users to view detailed information about selected movies or TV shows, including synopsis, cast details, trailer, release date, age rating, and runtime.
- **Watchlist:** Enable users to add movies and TV shows to a watchlist for easy access and future viewing.
- **Responsive Design:** Ensure the application is fully responsive and provides a consistent user experience across various devices and screen sizes.
- **Navigation:** Intuitive navigation to different sections:
  - **Home:** Main landing page featuring highlighted content and recommendations.
  - **TV Shows:** Section dedicated to TV shows, allowing users to browse and discover new series.
  - **Movies:** Section focused on movies, with options to browse by genre, release date, or popularity.
  - **Recently Added:** Showcases the latest additions to the content library.
  - **My List:** Personalized list where users can view their saved favorites and watch later items.

## Requirements

- Next.js
- Prisma
- NextAuth
- Tailwind CSS
- Shadcn/ui
- TypeScript

1. **Clone this repository:**
   ```bash
   git clone https://github.com/username/netflix-clone.git
   cd netflix-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm
   ```

3. **Set up the database:**
   ```bash
   npx prisma migrate dev
   npx prisma seed
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

## Usage
- **Access the application at http://localhost:3000:** after starting the development server.
- **Navigate** using the menu to switch between:
  - **Home** - Main landing page.
  - **TV Shows** - Section dedicated to TV shows.
  - **Movies** - Section dedicated to movies.
  - **Recently Added** - Section dedicated to recently added content.
  - **My List** - Personalized list of saved favorites and watch later items.

## CONTRIBUTING
If you would like to contribute to this project, please follow these steps:
1. Fork the repository 
2. Create a new branch for your changes
    ```bash
    git checkout -b feature/your-feature
    ```
3. Commit your changes
    ```bash
    git commit -m "Add your feature"
    ```
4. Push your changes
    ```bash
    git push origin feature/your-feature
    ```
5. Create a pull request

## Related Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
