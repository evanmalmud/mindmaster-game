import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/utils"
import { Button } from "./button"


function GameRow({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(className)}
            {...props}
        >
            <GameButton />
            <GameButton />
            <GameButton />
            <GameButton />
            <GameResults />
        </div>
    )
}

function GameButton({
    className
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Button
            className={cn('flex-1 size-24 border rounded-full border-solid border-black bg-white', className)}
        >
        </Button>
    )
}

function GameResults({
    className
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('grid grid-cols-2 justify-center content-center', className)}>
            <GameResultButton/>
            <GameResultButton/>
            <GameResultButton/>
            <GameResultButton/>
        </div>
    )
}

function GameResultButton({
    className
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Button
            className={cn('flex-1 shrink size-2 border rounded-full border-solid border-black bg-white', className)}
        >
        </Button>
    )
}

export { GameRow }
