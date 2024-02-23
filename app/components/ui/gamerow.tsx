import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/utils"
import { Button } from "./button"
import { array } from "zod"


// Create game state for buttons inputs
// The index of the color for each button

const masterMindColors = ['bg-red-400', 'bg-blue-400','bg-amber-400', 'bg-yellow-200', 'bg-lime-300'];


function GameRow({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('gap-2', className)}
            {...props}
        >
            <GameButton/>
            <GameButton />
            <GameButton />
            <GameButton />
            <GameResults />
        </div>
    )
}

function GameButton({
    className,
}: React.HTMLAttributes<HTMLButtonElement>) {
    const [buttonState, setButtonState] = React.useState(0);

    const onClick = () => {

        if(buttonState + 1 >= masterMindColors.length) {
            setButtonState(0);
        } else {
            setButtonState(buttonState + 1);
        }
    }
    return (
        <button
            onClick={onClick}
            className={cn('size-24 border rounded-full border-solid border-black', masterMindColors[buttonState], className)}
        >
        </button>
    )
}

function GameResults({
    className
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('ml-auto px-2 grid grid-cols-2 gap-1 justify-center content-center', className)}>
            <GameResultButton />
            <GameResultButton />
            <GameResultButton />
            <GameResultButton />
        </div>
    )
}

function GameResultButton({
    className
}: React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <div>
            <button
                className={cn('size-8 border rounded-full border-solid border-black bg-white', className)}
            >
            </button>
        </div>
    )
}

export { GameRow }
