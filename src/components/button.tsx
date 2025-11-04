import { type FunctionComponent } from 'react'
import { type Signal, useSignal } from '@preact/signals-react'
import './button.css'

interface ButtonProps {
    onClick?:(ev:React.MouseEvent)=>void|Promise<void>;
    isSpinning?:Signal<boolean>;
    className?:string;
    children?:React.ReactNode;
    disabled?:boolean;
}

export const Button:FunctionComponent<ButtonProps> = function (props) {
    const { isSpinning: _isSpinning, ..._props } = props
    const isSpinning = _isSpinning || useSignal<boolean>(false)

    const classes = (['btn', props.className, isSpinning.value ? 'spinning' : ''])
        .filter(Boolean).join(' ').trim()

    async function click (ev:React.MouseEvent) {
        if (props.onClick) {
            isSpinning.value = true
            await props.onClick(ev)
            isSpinning.value = false
        }
    }

    return <button
        {..._props}
        onClick={click}
        disabled={isSpinning.value || _props.disabled}
        className={classes}
    >
        <span className="btn-content">{props.children}</span>
    </button>
}
