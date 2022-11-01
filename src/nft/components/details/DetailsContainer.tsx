import useCopyClipboard from 'hooks/useCopyClipboard'
import { CollectionInfoForAsset, GenieAsset } from 'nft/types'
import { putCommas } from 'nft/utils'
import { shortenAddress } from 'nft/utils/address'
import { useCallback } from 'react'
import { Copy } from 'react-feather'
import styled from 'styled-components/macro'

const Details = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 40px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr 1fr;
  }
`

const Header = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  line-height: 20px;
`

const Body = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 14px;
  line-height: 20px;
  margin-top: 8px;
`

const Center = styled.span`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 8px;

  &:hover {
    opacity: ${({ theme }) => theme.opacity.hover};
  }

  &:active {
    opacity: ${({ theme }) => theme.opacity.click};
  }

  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => `opacity ${duration.medium} ${timing.ease}`};
`

const CopyIcon = styled(Copy)`
  cursor: pointer;
`

const GridItem = ({ header, body }: { header: string; body: React.ReactNode }) => {
  return (
    <div>
      <Header>{header}</Header>
      <Body>{body}</Body>
    </div>
  )
}

const stringShortener = (text: string) => `${text.substring(0, 4)}...${text.substring(text.length - 4, text.length)}`

const DetailsContainer = ({ asset, collection }: { asset: GenieAsset; collection: CollectionInfoForAsset }) => {
  const { address, tokenId, tokenType, creator } = asset
  const { totalSupply } = collection

  const [, setCopied] = useCopyClipboard()
  const copy = useCallback(() => {
    setCopied(address || '')
  }, [address, setCopied])

  return (
    <Details>
      <GridItem
        header="Contract address"
        body={
          <Center onClick={copy}>
            {shortenAddress(address, 2, 4)} <CopyIcon size={13} />
          </Center>
        }
      />
      <GridItem header="Token ID" body={tokenId.length > 9 ? stringShortener(tokenId) : tokenId} />
      <GridItem header="Token standard" body={tokenType} />
      <GridItem header="Blockchain" body="Ethereum" />
      <GridItem header="Total supply" body={`${putCommas(totalSupply)}`} />
      <GridItem header="Creator" body={shortenAddress(creator.address, 2, 4)} />
    </Details>
  )
}

export default DetailsContainer
