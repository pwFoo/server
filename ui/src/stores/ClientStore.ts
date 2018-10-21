import {BaseStore} from './BaseStore';
import axios from 'axios';
import * as config from '../config';
import {action} from 'mobx';
import {SnackReporter} from '../snack/SnackManager';

export class ClientStore extends BaseStore<IClient> {
    public constructor(private readonly snack: SnackReporter) {
        super();
    }

    protected requestItems = (): Promise<IClient[]> => {
        return axios.get<IClient[]>(`${config.get('url')}client`).then((response) => response.data);
    };

    protected requestDelete(id: number): Promise<void> {
        return axios
            .delete(`${config.get('url')}client/${id}`)
            .then(() => this.snack('Client deleted'));
    }

    @action
    public createNoNotifcation = async (name: string): Promise<IClient> => {
        const client = await axios.post(`${config.get('url')}client`, {name});
        await this.refresh();
        return client.data;
    };

    @action
    public create = async (name: string): Promise<void> => {
        await this.createNoNotifcation(name);
        this.snack('Client added');
    };
}
