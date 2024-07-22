import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';

interface GenericTextInputProps {
    icon: string
    type?: 'text' | 'number' | 'password'
    value: string | number;
    label: string
    id: string
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => void
}

const GenericTextInput: React.FC<GenericTextInputProps> = ({ icon, type, value, label, id, onChange}) => {

    const renderInput = () => {
        switch (type) {
            case 'password':
                return (
                    <Password id={id} value={value} onChange={onChange}  feedback={false}/>
                )
            case 'number':
                return (
                    <InputNumber id={id} value={value as number} onValueChange={onChange as any} />
                )
            default:
                return (
                    <InputText id={id} value={value as string} onChange={onChange} />
                )
        }
    }
    return (
        <>
            <div className="p-inputgroup flex-1 mb-4">
                <span className="p-inputgroup-addon">
                    <i className={`pi pi-${icon}`}></i>
                </span>
                <FloatLabel>
                    {renderInput()}
                    <label htmlFor={id}>{label}</label>
                </FloatLabel>
            </div>
        </>
    )
}

export default GenericTextInput