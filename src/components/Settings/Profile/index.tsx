import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card, CardBody } from '@components/UI/Card'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import React, { useContext, useState } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Sidebar from '../Sidebar'
import NFTPicture from './NFTPicture'
import Picture from './Picture'
import Profile from './Profile'

const PROFILE_SETTINGS_QUERY = gql`
  query ProfileSettings($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        name
        location
        website
        twitter
        bio
        attributes {
          key
          value
        }
        coverPicture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
          ... on NftImage {
            uri
            tokenId
          }
        }
      }
    }
  }
`

const ProfileSettings: NextPage = () => {
  const { currentUser } = useContext(AppContext)
  const [nftSettings, setNftSettings] = useState<boolean>(false)
  const { data, loading, error } = useQuery(PROFILE_SETTINGS_QUERY, {
    variables: { request: { profileIds: currentUser?.id } },
    skip: !currentUser?.id,
    onCompleted(data) {
      consoleLog('Query', '#8b5cf6', `Fetched profile settings`)
      setNftSettings(!!data?.profiles?.items[0]?.picture?.uri)
    }
  })

  if (error) return <Custom500 />
  if (loading) return <PageLoading message="Loading settings" />
  if (!currentUser) return <Custom404 />

  const profile = data?.profiles?.items[0]

  return (
    <GridLayout>
      <SEO title="Profile settings • Lenster" />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Profile profile={profile} />
        <Card>
          <CardBody>
            {nftSettings ? (
              <NFTPicture profile={profile} />
            ) : (
              <Picture profile={profile} />
            )}
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default ProfileSettings
