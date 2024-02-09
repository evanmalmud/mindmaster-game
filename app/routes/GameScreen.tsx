import { motion } from 'framer-motion';
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { authenticator } from "~/services/auth.server";

export default function GameScreen() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center">
        <motion.h1
          animate={{ opacity: 1, y: -200 }}
          initial={{ opacity: 0, y: -700 }}
          transition={{ duration: 0.5 }}
          className="font-display text-6xl uppercase"
        >
          Mastermind
        </motion.h1>
        <div
          className={`flex flex-col box-border rounded bg-black min-h-96 min-w-full  border-solid border-black`}
        >
          <div className={"flex-1"}>01</div>
          <div className={"flex-1"}>02</div>
          <div className={"flex-1"}>03</div>
          <div className={"flex-1"}>04</div>
          <div className={"flex-1"}>05</div>
        </div>
      </div>
    </main>
  );
}
