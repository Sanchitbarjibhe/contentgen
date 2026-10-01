"use client";

import React from "react";
// Named import framing sathi Direct motion object import kara
import { motion } from "framer-motion";
import { LogIn, BookOpen, LayoutDashboard, ArrowRight } from "lucide-react";

interface HeroButtonsProps {
    onSignIn?: () => void;
    onReadBlogs?: () => void;
    onExploreDashboard?: () => void;
}

export default function HeroButtons({
    onSignIn,
    onReadBlogs,
    onExploreDashboard,
}: HeroButtonsProps): JSX.Element {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">

            {/* 1. Primary Button: Sign In */}
            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSignIn}
                className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black w-full sm:w-auto"
            >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-75 blur-[2px] group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

                <div className="relative px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-2 text-white font-semibold text-sm sm:text-base border border-white/10 shadow-lg shadow-purple-500/20">
                    {/* <LogIn className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" /> */}
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
            </motion.button>

            {/* 2. Secondary Button: Explore Dashboard */}
            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onExploreDashboard}
                className="relative group px-5 py-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white font-medium text-sm sm:text-base transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 shadow-sm hover:shadow-purple-500/20 w-full sm:w-auto"
            >
                <LayoutDashboard className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <span>Explore Dashboard</span>
            </motion.button>

            {/* 3. Ghost Button: Read Blogs */}
            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onReadBlogs}
                className="relative group px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium text-sm sm:text-base transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
            >
                <BookOpen className="w-4 h-4 text-indigo-400 group-hover:rotate-6 transition-transform duration-300" />
                <span>Read Blogs</span>
            </motion.button>

        </div>
    );
}