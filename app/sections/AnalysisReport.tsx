'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Loader2, RefreshCw, Layers, Cpu, Globe, Zap, Code,
  AlertTriangle, Check, ChevronRight, Settings,
  Database, Star
} from 'lucide-react'

interface AnalysisReportProps {
  report: any
  url: string
  analyzing: boolean
  onReset: () => void
}

const STEPS = [
  'Extracting tech stack...',
  'Parsing agent configurations...',
  'Mapping data flows...',
  'Analyzing prompts...',
  'Generating report...',
]

function ConfidenceBadge({ level }: { level: string }) {
  const l = (level ?? '').toLowerCase()
  if (l === 'high') return <Badge className="bg-[hsl(80,80%,50%)] text-[hsl(70,10%,10%)] rounded-none text-[10px] font-mono">HIGH</Badge>
  if (l === 'medium') return <Badge className="bg-[hsl(52,100%,62%)] text-[hsl(70,10%,10%)] rounded-none text-[10px] font-mono">MED</Badge>
  return <Badge className="bg-[hsl(338,95%,55%)] text-white rounded-none text-[10px] font-mono">LOW</Badge>
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = (priority ?? '').toLowerCase()
  if (p === 'high' || p === 'critical') return <Badge className="bg-[hsl(338,95%,55%)] text-white rounded-none text-[10px] font-mono">{(priority ?? '').toUpperCase()}</Badge>
  if (p === 'medium') return <Badge className="bg-[hsl(52,100%,62%)] text-[hsl(70,10%,10%)] rounded-none text-[10px] font-mono">MEDIUM</Badge>
  return <Badge className="bg-[hsl(70,10%,26%)] text-[hsl(50,6%,58%)] rounded-none text-[10px] font-mono">{(priority ?? 'LOW').toUpperCase()}</Badge>
}

function ImpactBadge({ impact }: { impact: string }) {
  const i = (impact ?? '').toLowerCase()
  if (i === 'high') return <Badge variant="outline" className="border-[hsl(80,80%,50%)] text-[hsl(80,80%,50%)] rounded-none text-[10px] font-mono">HIGH IMPACT</Badge>
  if (i === 'medium') return <Badge variant="outline" className="border-[hsl(52,100%,62%)] text-[hsl(52,100%,62%)] rounded-none text-[10px] font-mono">MED IMPACT</Badge>
  return <Badge variant="outline" className="border-[hsl(50,6%,58%)] text-[hsl(50,6%,58%)] rounded-none text-[10px] font-mono">LOW IMPACT</Badge>
}

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? '').toLowerCase()
  if (s === 'active' || s === 'connected') return <Badge className="bg-[hsl(80,80%,50%)] text-[hsl(70,10%,10%)] rounded-none text-[10px] font-mono">{(status ?? '').toUpperCase()}</Badge>
  return <Badge className="bg-[hsl(70,10%,26%)] text-[hsl(50,6%,58%)] rounded-none text-[10px] font-mono">{(status ?? 'UNKNOWN').toUpperCase()}</Badge>
}

function LoadingState() {
  const [step, setStep] = useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % STEPS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <Loader2 className="w-10 h-10 text-[hsl(52,100%,62%)] animate-spin mx-auto" />
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 justify-center">
              {i < step ? (
                <Check className="w-3.5 h-3.5 text-[hsl(80,80%,50%)]" />
              ) : i === step ? (
                <Loader2 className="w-3.5 h-3.5 text-[hsl(52,100%,62%)] animate-spin" />
              ) : (
                <div className="w-3.5 h-3.5 border border-[hsl(70,8%,22%)] rounded-full" />
              )}
              <span className={`text-sm font-mono ${i <= step ? 'text-[hsl(60,30%,96%)]' : 'text-[hsl(50,6%,58%)]'}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TechStackGroup({ title, items, icon }: { title: string; items: any[]; icon: React.ReactNode }) {
  const safeItems = Array.isArray(items) ? items : []
  if (safeItems.length === 0) return null
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-mono text-[hsl(50,6%,58%)] uppercase tracking-wider">
        {icon}
        {title}
      </div>
      <div className="space-y-1">
        {safeItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-[hsl(70,10%,14%)] border border-[hsl(70,8%,22%)]">
            <div>
              <span className="text-sm text-[hsl(60,30%,96%)] font-mono">{item?.name ?? 'Unknown'}</span>
              <span className="text-xs text-[hsl(50,6%,58%)] ml-2">{item?.category ?? ''}</span>
            </div>
            <ConfidenceBadge level={item?.confidence ?? 'low'} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalysisReport({ report, url, analyzing, onReset }: AnalysisReportProps) {
  if (analyzing) return <LoadingState />

  const exec = report?.executive_summary
  const tech = report?.tech_stack
  const arch = report?.agent_architecture
  const dataFlow = report?.data_flow_integrations
  const prompts = report?.prompt_analysis
  const perf = report?.performance_optimization

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-mono text-[hsl(60,30%,96%)]">
              {exec?.app_name ?? 'Application Analysis'}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-[hsl(50,6%,58%)]">
              <Globe className="w-3 h-3" />
              <span className="font-mono truncate max-w-md">{url}</span>
            </div>
          </div>
          <Button onClick={onReset} variant="outline" className="bg-transparent border-[hsl(70,8%,22%)] text-[hsl(50,6%,58%)] hover:bg-[hsl(70,10%,22%)] hover:text-[hsl(60,30%,96%)] rounded-none text-xs font-mono">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            New Analysis
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="bg-[hsl(70,10%,16%)] border-[hsl(70,8%,22%)] rounded-none">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Badge className="bg-[hsl(261,100%,75%)] text-white rounded-none text-[10px] font-mono">
                {exec?.architecture_pattern ?? 'N/A'}
              </Badge>
              <div className="flex gap-4 text-xs font-mono text-[hsl(50,6%,58%)]">
                <span><Cpu className="w-3 h-3 inline mr-1" />{exec?.agent_count ?? '0'} agents</span>
                <span><Globe className="w-3 h-3 inline mr-1" />{exec?.integration_count ?? '0'} integrations</span>
                <span><Database className="w-3 h-3 inline mr-1" />{exec?.kb_count ?? '0'} KBs</span>
              </div>
            </div>
            <p className="text-sm text-[hsl(60,30%,96%)]">{exec?.overall_assessment ?? ''}</p>
            {Array.isArray(exec?.key_findings) && exec.key_findings.length > 0 && (
              <div className="mt-3 space-y-1">
                {exec.key_findings.map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[hsl(50,6%,58%)]">
                    <ChevronRight className="w-3 h-3 mt-0.5 text-[hsl(52,100%,62%)] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="tech" className="w-full">
          <TabsList className="bg-[hsl(70,10%,16%)] border border-[hsl(70,8%,22%)] rounded-none w-full justify-start gap-0 h-auto p-0 flex-wrap">
            {[
              { v: 'tech', l: 'Tech Stack', icon: <Layers className="w-3.5 h-3.5" /> },
              { v: 'agents', l: 'Agents', icon: <Cpu className="w-3.5 h-3.5" /> },
              { v: 'data', l: 'Data Flow', icon: <Globe className="w-3.5 h-3.5" /> },
              { v: 'prompts', l: 'Prompts', icon: <Code className="w-3.5 h-3.5" /> },
              { v: 'perf', l: 'Performance', icon: <Zap className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <TabsTrigger key={tab.v} value={tab.v} className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(52,100%,62%)] data-[state=active]:bg-transparent data-[state=active]:text-[hsl(52,100%,62%)] text-[hsl(50,6%,58%)] text-xs font-mono px-4 py-2.5 gap-1.5">
                {tab.icon}
                {tab.l}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tech Stack Tab */}
          <TabsContent value="tech" className="mt-4">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <TechStackGroup title="Frontend" items={tech?.frontend} icon={<Layers className="w-3.5 h-3.5" />} />
                <TechStackGroup title="Backend" items={tech?.backend} icon={<Settings className="w-3.5 h-3.5" />} />
                <TechStackGroup title="AI / ML" items={tech?.ai_ml} icon={<Cpu className="w-3.5 h-3.5" />} />
                <TechStackGroup title="Infrastructure" items={tech?.infrastructure} icon={<Database className="w-3.5 h-3.5" />} />
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="mt-4">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {arch?.pattern_description && (
                  <Card className="bg-[hsl(70,10%,14%)] border-[hsl(70,8%,22%)] rounded-none">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-[hsl(190,81%,67%)] text-[hsl(70,10%,10%)] rounded-none text-[10px] font-mono">{arch?.pattern ?? 'Pattern'}</Badge>
                      </div>
                      <p className="text-xs text-[hsl(50,6%,58%)]">{arch.pattern_description}</p>
                    </CardContent>
                  </Card>
                )}
                {Array.isArray(arch?.agents) && arch.agents.map((agent: any, i: number) => (
                  <Card key={i} className="bg-[hsl(70,10%,16%)] border-[hsl(70,8%,22%)] rounded-none">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-semibold text-[hsl(60,30%,96%)]">{agent?.name ?? 'Agent'}</span>
                        <Badge className="bg-[hsl(35,100%,50%)] text-[hsl(70,10%,10%)] rounded-none text-[10px] font-mono">{(agent?.type ?? 'agent').toUpperCase()}</Badge>
                      </div>
                      <p className="text-xs text-[hsl(50,6%,58%)]">{agent?.description ?? ''}</p>
                      <div className="flex flex-wrap gap-3 text-xs font-mono text-[hsl(50,6%,58%)]">
                        <span><Cpu className="w-3 h-3 inline mr-1" />{agent?.model ?? 'N/A'}</span>
                        <span><Settings className="w-3 h-3 inline mr-1" />temp: {agent?.temperature ?? 'N/A'}</span>
                      </div>
                      {Array.isArray(agent?.tools) && agent.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-[10px] text-[hsl(50,6%,58%)] font-mono mr-1">Tools:</span>
                          {agent.tools.map((t: string, j: number) => (
                            <Badge key={j} variant="outline" className="border-[hsl(70,8%,22%)] text-[hsl(80,80%,50%)] rounded-none text-[10px] font-mono">{t}</Badge>
                          ))}
                        </div>
                      )}
                      {Array.isArray(agent?.knowledge_bases) && agent.knowledge_bases.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-[10px] text-[hsl(50,6%,58%)] font-mono mr-1">KBs:</span>
                          {agent.knowledge_bases.map((kb: string, j: number) => (
                            <Badge key={j} variant="outline" className="border-[hsl(70,8%,22%)] text-[hsl(190,81%,67%)] rounded-none text-[10px] font-mono">{kb}</Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {Array.isArray(arch?.communication_flows) && arch.communication_flows.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono text-[hsl(50,6%,58%)] uppercase tracking-wider">Communication Flows</h3>
                    {arch.communication_flows.map((flow: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 py-1.5 px-3 bg-[hsl(70,10%,14%)] border border-[hsl(70,8%,22%)] text-xs">
                        <span className="font-mono text-[hsl(80,80%,50%)]">{flow?.from ?? '?'}</span>
                        <ChevronRight className="w-3 h-3 text-[hsl(52,100%,62%)]" />
                        <span className="font-mono text-[hsl(190,81%,67%)]">{flow?.to ?? '?'}</span>
                        <Separator orientation="vertical" className="h-3 bg-[hsl(70,8%,22%)]" />
                        <span className="text-[hsl(50,6%,58%)]">{flow?.description ?? ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Data Flow Tab */}
          <TabsContent value="data" className="mt-4">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {Array.isArray(dataFlow?.data_flows) && dataFlow.data_flows.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono text-[hsl(50,6%,58%)] uppercase tracking-wider">Data Flows</h3>
                    {dataFlow.data_flows.map((df: any, i: number) => (
                      <Card key={i} className="bg-[hsl(70,10%,14%)] border-[hsl(70,8%,22%)] rounded-none">
                        <CardContent className="p-3 space-y-1">
                          <span className="font-mono text-sm text-[hsl(60,30%,96%)]">{df?.name ?? 'Flow'}</span>
                          <p className="text-xs text-[hsl(190,81%,67%)] font-mono">{df?.path ?? ''}</p>
                          <p className="text-xs text-[hsl(50,6%,58%)]">{df?.description ?? ''}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {Array.isArray(dataFlow?.integrations) && dataFlow.integrations.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono text-[hsl(50,6%,58%)] uppercase tracking-wider">Integrations</h3>
                    {dataFlow.integrations.map((intg: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-[hsl(70,10%,14%)] border border-[hsl(70,8%,22%)]">
                        <div>
                          <span className="text-sm text-[hsl(60,30%,96%)] font-mono">{intg?.name ?? 'Integration'}</span>
                          <span className="text-xs text-[hsl(50,6%,58%)] ml-2">{intg?.type ?? ''}</span>
                        </div>
                        <StatusBadge status={intg?.status ?? 'unknown'} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="mt-4">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {prompts?.overall_quality && (
                  <Card className="bg-[hsl(70,10%,14%)] border-[hsl(70,8%,22%)] rounded-none">
                    <CardContent className="p-3 flex items-center gap-3">
                      <Star className="w-5 h-5 text-[hsl(52,100%,62%)]" />
                      <div>
                        <span className="text-xs font-mono text-[hsl(50,6%,58%)] uppercase">Overall Quality</span>
                        <p className="text-sm font-mono text-[hsl(60,30%,96%)]">{prompts.overall_quality}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {Array.isArray(prompts?.patterns) && prompts.patterns.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono text-[hsl(50,6%,58%)] uppercase tracking-wider">Patterns</h3>
                    {prompts.patterns.map((pat: any, i: number) => (
                      <Card key={i} className="bg-[hsl(70,10%,16%)] border-[hsl(70,8%,22%)] rounded-none">
                        <CardContent className="p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm text-[hsl(60,30%,96%)]">{pat?.name ?? 'Pattern'}</span>
                            <ConfidenceBadge level={pat?.quality ?? 'low'} />
                          </div>
                          <p className="text-xs text-[hsl(50,6%,58%)]">{pat?.suggestion ?? ''}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(prompts?.strengths) && prompts.strengths.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-mono text-[hsl(80,80%,50%)] uppercase tracking-wider flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Strengths
                      </h3>
                      {prompts.strengths.map((s: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 py-1.5 px-3 bg-[hsl(70,10%,14%)] border border-[hsl(70,8%,22%)] text-xs text-[hsl(60,30%,96%)]">
                          <Check className="w-3 h-3 mt-0.5 text-[hsl(80,80%,50%)] shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {Array.isArray(prompts?.weaknesses) && prompts.weaknesses.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-mono text-[hsl(338,95%,55%)] uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Weaknesses
                      </h3>
                      {prompts.weaknesses.map((w: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 py-1.5 px-3 bg-[hsl(70,10%,14%)] border border-[hsl(70,8%,22%)] text-xs text-[hsl(60,30%,96%)]">
                          <AlertTriangle className="w-3 h-3 mt-0.5 text-[hsl(338,95%,55%)] shrink-0" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="perf" className="mt-4">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {perf?.model_assessment && (
                    <Card className="bg-[hsl(70,10%,14%)] border-[hsl(70,8%,22%)] rounded-none">
                      <CardContent className="p-3">
                        <span className="text-[10px] font-mono text-[hsl(50,6%,58%)] uppercase">Model Assessment</span>
                        <p className="text-sm text-[hsl(60,30%,96%)] mt-1">{perf.model_assessment}</p>
                      </CardContent>
                    </Card>
                  )}
                  {perf?.temperature_assessment && (
                    <Card className="bg-[hsl(70,10%,14%)] border-[hsl(70,8%,22%)] rounded-none">
                      <CardContent className="p-3">
                        <span className="text-[10px] font-mono text-[hsl(50,6%,58%)] uppercase">Temperature Assessment</span>
                        <p className="text-sm text-[hsl(60,30%,96%)] mt-1">{perf.temperature_assessment}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                {Array.isArray(perf?.recommendations) && perf.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono text-[hsl(50,6%,58%)] uppercase tracking-wider">Recommendations</h3>
                    {perf.recommendations.map((rec: any, i: number) => (
                      <Card key={i} className="bg-[hsl(70,10%,16%)] border-[hsl(70,8%,22%)] rounded-none">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="font-mono text-sm text-[hsl(60,30%,96%)]">{rec?.area ?? 'Area'}</span>
                            <div className="flex gap-1.5">
                              <PriorityBadge priority={rec?.priority ?? 'low'} />
                              <ImpactBadge impact={rec?.impact ?? 'low'} />
                            </div>
                          </div>
                          <p className="text-xs text-[hsl(50,6%,58%)]">{rec?.recommendation ?? ''}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
