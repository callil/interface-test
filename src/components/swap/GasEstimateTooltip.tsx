import { InterfaceElementName, SwapEventName } from '@uniswap/analytics-events'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { useWeb3React } from '@web3-react/core'
import { sendAnalyticsEvent } from 'analytics'
import { LoadingOpacityContainer } from 'components/Loader/styled'
import { UniswapXRouterIcon } from 'components/RouterLabel/UniswapXRouterLabel'
import Row, { RowFixed } from 'components/Row'
import { MouseoverTooltip, TooltipSize } from 'components/Tooltip'
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from 'constants/chains'
import { InterfaceTrade } from 'state/routing/types'
import { isUniswapXTrade } from 'state/routing/utils'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

import { ReactComponent as GasIcon } from '../../assets/svg/gas-icon.svg'
import { GasBreakdownTooltip } from './GasBreakdownTooltip'

const StyledGasIcon = styled(GasIcon)`
  height: 16px;
  width: 16px;
  // We apply the following to all children of the SVG in order to override the default color
  & > * {
    fill: ${({ theme }) => theme.neutral2};
  }
`

export default function GasEstimateTooltip({ trade, loading }: { trade?: InterfaceTrade; loading: boolean }) {
  const { chainId } = useWeb3React()

  if (!trade || !chainId || !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId)) {
    return null
  }

  return (
    <MouseoverTooltip
      size={TooltipSize.Small}
      text={<GasBreakdownTooltip trade={trade} />}
      onOpen={() => {
        sendAnalyticsEvent(SwapEventName.SWAP_AUTOROUTER_VISUALIZATION_EXPANDED, {
          element: InterfaceElementName.AUTOROUTER_VISUALIZATION_ROW,
        })
      }}
      placement="right"
    >
      <LoadingOpacityContainer $loading={loading}>
        <RowFixed gap="xs">
          {isUniswapXTrade(trade) ? <UniswapXRouterIcon /> : <StyledGasIcon />}
          <ThemedText.BodySmall color="neutral2">
            <Row gap="xs">
              <div>{formatNumber(trade.totalGasUseEstimateUSD, NumberType.FiatGasPrice)}</div>
              {isUniswapXTrade(trade) && (
                <div>
                  <s>{formatNumber(trade.classicGasUseEstimateUSD, NumberType.FiatGasPrice)}</s>
                </div>
              )}
            </Row>
          </ThemedText.BodySmall>
        </RowFixed>
      </LoadingOpacityContainer>
    </MouseoverTooltip>
  )
}
