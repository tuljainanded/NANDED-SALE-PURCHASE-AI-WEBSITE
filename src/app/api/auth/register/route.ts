import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { name, identifier, password } = await req.json();

        if (!name || !identifier || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        const isEmail = identifier.includes('@');
        const query = isEmail ? { email: identifier } : { mobile: identifier };

        const existingUser = await User.findOne(query);

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists with this email/mobile' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email: isEmail ? identifier : undefined,
            mobile: !isEmail ? identifier : undefined,
            password: hashedPassword,
        });

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
    }
}
