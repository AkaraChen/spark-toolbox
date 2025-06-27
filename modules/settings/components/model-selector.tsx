import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import { ReactNode, useId } from 'react'

interface ModelSelectorProps {
    models: string[]
    selectedModel: string
    onModelChange: (model: string) => void
    disabled?: boolean
    label: ReactNode
}

export function ModelSelector({
    models,
    selectedModel,
    onModelChange,
    disabled,
    label,
}: ModelSelectorProps) {
    const handleModelChange = (event: SelectChangeEvent) => {
        onModelChange(event.target.value)
    }
    const id = useId()
    return (
        <FormControl fullWidth disabled={disabled}>
            <InputLabel id={id}>{label}</InputLabel>
            <Select
                labelId={id}
                value={selectedModel}
                label={label}
                onChange={handleModelChange}
            >
                {models?.map(model => (
                    <MenuItem key={model} value={model}>
                        {model}
                    </MenuItem>
                ))}
                {models.every(model => model !== selectedModel) && (
                    <MenuItem value={selectedModel}>{selectedModel}</MenuItem>
                )}
            </Select>
        </FormControl>
    )
}
