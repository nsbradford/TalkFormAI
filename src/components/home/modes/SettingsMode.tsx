import { User } from '@/types';

type SettingsModeProps = {
    user: User;
}



export default function SettingsMode(props: SettingsModeProps) {
    return (
        <p>{JSON.stringify(props.user)}</p>
    ) 
}
