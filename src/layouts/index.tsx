import { IRouteComponentProps } from 'umi';
import CommonHeader from './Header';

import './index.less';

export default function Layout({
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps) {
  return (
    <div className="container">
      <CommonHeader />
      {children}
    </div>
  );
}
