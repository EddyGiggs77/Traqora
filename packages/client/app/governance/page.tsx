"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plane,
  Shield,
  Plus,
  Zap,
  Users,
  CheckCircle,
  Vote,
  History,
  ArrowLeft,
} from "lucide-react"
import { useGovernance, useVotingPower } from "@/hooks/governance/useGovernance"
import { ProposalCard } from "@/components/governance/proposal-card"
import { AlertTriangle, Clock, FileText, Scale } from "lucide-react"
import { VotingPowerCard } from "@/components/governance/voting-power-card"
import { NavWalletButton } from "@/components/nav-wallet-button"

export default function GovernancePage() {
  const { proposals, activeProposals, passedProposals, rejectedProposals, loading } = useGovernance()
  const { votingPower } = useVotingPower('current-user-address') // TODO: Get from wallet context
  const [activeTab, setActiveTab] = useState("all")

  const getFilteredProposals = () => {
    switch (activeTab) {
      case "active":
        return activeProposals
      case "passed":
        return passedProposals
      case "rejected":
        return rejectedProposals
      default:
        return proposals
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header role="banner">
        <nav aria-label="Main navigation" className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Plane className="h-8 w-8 text-primary" aria-hidden="true" />
                <span className="font-serif font-bold text-2xl text-foreground">Traqora</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Search Flights
                </Link>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Badge variant="secondary" className="px-3 py-1">
                  <Shield className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
                  Governance
                </Badge>
                <Link href="/refunds/dispute" className="text-muted-foreground hover:text-foreground transition-colors">
                  Disputes
                </Link>
                <NavWalletButton />
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Dashboard
          </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif font-bold text-3xl text-foreground mb-2">DAO Governance</h1>
            <p className="text-muted-foreground">
              Vote on proposals, delegate your power, and shape the future of Traqora
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/governance/delegate">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Delegation
              </Button>
            </Link>
            <Link href="/governance/history">
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                Voting History
              </Button>
            </Link>
            <Link href="/governance/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Proposals</p>
                  <p className="text-2xl font-bold">{activeProposals.length}</p>
                </div>
                <Vote className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Proposals</p>
                  <p className="text-2xl font-bold">{proposals.length}</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Voting Power</p>
                  <p className="text-2xl font-bold">{votingPower.totalVotingPower.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Passed Proposals</p>
                  <p className="text-2xl font-bold">{passedProposals.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All ({proposals.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeProposals.length})</TabsTrigger>
                <TabsTrigger value="passed">Passed ({passedProposals.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedProposals.length})</TabsTrigger>
                <TabsTrigger value="disputes">Active Disputes</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {activeTab === "disputes" ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-serif flex items-center gap-2">
                          <Scale className="h-5 w-5 text-primary" />
                          Dispute Resolution & Evidence Workflow
                        </CardTitle>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                          <Clock className="h-3 w-3 mr-1" /> Timeline Active
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-4">
                        <div className="border-l-2 border-primary/30 pl-4 space-y-6 ml-2">
                          <div className="relative">
                            <div className="absolute -left-[21px] top-0 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                            <p className="text-xs text-muted-foreground">Phase 1</p>
                            <h4 className="font-medium text-sm text-foreground">Dispute Opened & Evidence Submission</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Claimant submitted booking dispute and uploaded supporting evidence via IPFS gateway.
                            </p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[21px] top-0 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                            <p className="text-xs text-muted-foreground">Phase 2</p>
                            <h4 className="font-medium text-sm text-foreground">Arbitrator Assignment</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Randomized verifiable arbitrator assigned from the registered DAO pool.
                            </p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[21px] top-0 h-3 w-3 rounded-full bg-muted ring-4 ring-background" />
                            <p className="text-xs text-muted-foreground">Phase 3</p>
                            <h4 className="font-medium text-sm text-foreground">Two-Phase Voting & Resolution</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Arbitrator review and commitment-reveal voting period for final verdict enforcement.
                            </p>
                          </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                          <Link href="/refunds/dispute">
                            <Button size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Manage Disputes
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : loading ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                      <p className="text-muted-foreground">Loading proposals...</p>
                    </CardContent>
                  </Card>
                ) : getFilteredProposals().length > 0 ? (
                  getFilteredProposals().map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No proposals found</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <VotingPowerCard
              baseBalance={votingPower.baseBalance}
              delegatedToUser={votingPower.delegatedToUser}
              delegatedAway={votingPower.delegatedAway}
              totalVotingPower={votingPower.totalVotingPower}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-serif">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/governance/delegate">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Delegation
                  </Button>
                </Link>
                <Link href="/governance/history">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    My Voting History
                  </Button>
                </Link>
                <Link href="/governance/create">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Proposal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>

      {/* Footer — landmark: contentinfo */}
      <footer role="contentinfo" className="sr-only">
        <p>© {new Date().getFullYear()} Traqora. Decentralized flight booking powered by Stellar.</p>
      </footer>
    </div>
  )
}
