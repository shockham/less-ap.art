import { Import, useDeno } from 'https://deno.land/x/aleph/mod.ts'
import React, { useState } from 'https://esm.sh/react'
import Logo from '../components/logo.tsx'
import Canvas from '../components/Three.tsx'

export default function Home() {
    const [count, setCount] = useState(0)
    const version = useDeno(() => {
        return Deno.version
    })

    return (
        <div className="page">
            <Import from="../style/index.less" />
            <Canvas />
            <p className="counter">
                <span>Counter:</span>
                <strong>{count}</strong>
                <button onClick={() => setCount(n => n - 1)}>-</button>
                <button onClick={() => setCount(n => n + 1)}>+</button>
            </p>
            <p className="copyinfo">Built by Aleph.js in Deno v{version.deno}</p>
        </div>
    )
}
