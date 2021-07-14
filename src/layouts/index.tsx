import { IRouteComponentProps } from 'umi'
import CommonHeader from './Header'
import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary } from '@/utils/web3'
import { RefreshContextProvider } from '@/contexts/RefreshContext'

import './index.less'

export default function Layout({ children, location, route, history, match }: IRouteComponentProps) {
    return <Web3ReactProvider getLibrary={getLibrary}>
        <RefreshContextProvider>
            <div className="container">
                <CommonHeader />
                {children}
            </div>
        </RefreshContextProvider>
    </Web3ReactProvider>
}