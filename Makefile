setup:
	pnpm create next-app nextauth-nextjs14-prisma
install dependecies:
	pnpm add next-auth@beta @auth/prisma-adapter
	pnpm add @prisma/client
	pnpm add bcryptjs
	pnpm add -D prisma ts-node @types/bcryptjs

	pnpm add zod @hookform/resolvers react-hook-form tailwind-merge
	pnpm add react-hot-toast

commands:
	docker-compose up -d
	docker-compose down
	pnpm prisma init --datasource-provider postgresql
	pnpm prisma migrate dev --name init 

