import { AutoComplete, Input } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { useState } from 'react';
import { DAO } from 'src/controller/dao/daoSlice';
import { useAppSelector } from 'src/controller/hooks';

export default function AutoSearch() {
    const [options, setOptions] = useState<SelectProps<object>['options']>([]);
    const { daos } = useAppSelector(state => state.dao)

    const searchResult = (query: string, daos: DAO[]) => {
        let array = [];
        daos.forEach((dao, index) => {

            if (dao.title.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                array.push({
                    value: `${dao.title} ${index}` ,
                    label: (
                        <div
                            key={`search-dao-${index}`}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span key={`search-dao-span-${index}`}>
                                Found {query} on{' '}
                                <a
                                    key={`search-dao-link-${index}`}
                                    onClick={() => {}}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {dao.title}
                                </a>
                            </span>
                        </div >
                    ),
                })
            }

        })
        return array;
    }
    const handleSearch = (value: string) => {
        setOptions(value ? searchResult(value, daos) : []);
    };

    const onSelect = (value: string) => {
        console.log('onSelect', value);
    };

    return (
        <AutoComplete
            style={{ width: 300 }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
        >
            <Input.Search size="large" placeholder="search DAO by title" enterButton />
        </AutoComplete>
    );
}