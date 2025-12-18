import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactFlow, Background, Controls, Handle, Position, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { Upload, Loader2, BookOpen, ExternalLink, Youtube, Plus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface MindMapNode {
  id: string;
  label: string;
  type: 'parent' | 'child';
  nodeColor?: string;
}

interface MindMapEdge {
  id: string;
  source: string;
  target: string;
}

const SAMPLE_SYLLABUS = `Unit 1: Introduction to Data Structures
- Arrays and Dynamic Arrays
- Linked Lists (Singly and Doubly)
- Basic operations: Insert, Delete, Search

Unit 2: Stack and Queue
- Stack implementation and applications
- Queue types: Simple, Circular, Priority Queue
- Stack applications: Expression evaluation, Recursion

Unit 3: Trees and Graphs
- Binary Trees: Traversal and Searching
- Tree balancing: AVL and Red-Black Trees
- Graph representation and algorithms
- BFS and DFS traversals

Unit 4: Sorting and Searching
- Bubble Sort and Insertion Sort
- Quick Sort and Merge Sort
- Linear and Binary Search
- Analysis of sorting algorithms`;

const ParentNode = ({ data, selected }: any) => (
  <div
    style={{
      background: data.color || '#3b82f6',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 'bold',
      border: selected ? '3px solid #fbbf24' : '2px solid rgba(255,255,255,0.2)',
      cursor: 'pointer',
      width: '140px',
      textAlign: 'center',
      wordWrap: 'break-word',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    }}
    data-testid={`parent-node-${data.label}`}
  >
    {data.label}
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const ChildNode = ({ data, selected }: any) => (
  <div
    style={{
      background: data.color || '#8b5cf6',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '50%',
      fontSize: '11px',
      fontWeight: '500',
      border: selected ? '3px solid #fbbf24' : '2px solid rgba(255,255,255,0.3)',
      cursor: 'pointer',
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}
    data-testid={`child-node-${data.label}`}
  >
    {data.label}
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export function StudySupport() {
  const [syllabusText, setSyllabusText] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4'];

  const parseSyllabusText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const newNodes: MindMapNode[] = [];
    const newEdges: MindMapEdge[] = [];
    let currentParentId = '';
    let parentCounter = 0;
    let childCounter = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      // Check if it's a unit/module (parent node)
      if (/^(unit|module|chapter|section)\s+(\d+|[a-z])/i.test(trimmed)) {
        const parentId = `parent-${parentCounter}`;
        const parentLabel = trimmed.replace(/^(unit|module|chapter|section)\s+/i, '').slice(0, 30);
        
        newNodes.push({
          id: parentId,
          label: parentLabel,
          type: 'parent',
          nodeColor: COLORS[parentCounter % COLORS.length],
        });

        currentParentId = parentId;
        parentCounter++;
      } 
      // Child nodes (bullet points or indented lines)
      else if (currentParentId && (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed))) {
        const childLabel = trimmed.replace(/^[-•\d+.]\s*/, '').slice(0, 25);
        const childId = `child-${currentParentId}-${childCounter}`;

        newNodes.push({
          id: childId,
          label: childLabel,
          type: 'child',
          nodeColor: COLORS[(parentCounter - 1 + childCounter) % COLORS.length],
        });

        newEdges.push({
          id: `edge-${currentParentId}-${childId}`,
          source: currentParentId,
          target: childId,
        });

        childCounter++;
      }
    }

    return { newNodes, newEdges };
  };

  const generateReactFlowData = (syllabus: string) => {
    if (!syllabus.trim()) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { newNodes, newEdges } = parseSyllabusText(syllabus);
    
    // Position nodes
    const positioned = newNodes.map((node, idx) => {
      let x, y;
      if (node.type === 'parent') {
        const parentIndex = newNodes.filter((n, i) => n.type === 'parent' && i <= idx).length - 1;
        x = 200 + parentIndex * 250;
        y = 100;
      } else {
        const parentNode = newNodes.find(n => n.id === `parent-${parseInt(node.id.split('-')[1])}`);
        const parentIdx = parentNode ? newNodes.indexOf(parentNode) : 0;
        const childIdx = newNodes.filter(n => n.id.startsWith(`child-parent-${parseInt(node.id.split('-')[1])}`)).indexOf(node);
        x = 200 + parentIdx * 250;
        y = 250 + childIdx * 110;
      }

      return {
        id: node.id,
        data: { label: node.label, color: node.nodeColor },
        position: { x, y },
        type: node.type === 'parent' ? 'parentNode' : 'childNode',
      };
    });

    const positionedEdges = newEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed },
    }));

    setNodes(positioned);
    setEdges(positionedEdges);
  };

  const handleLoadSample = () => {
    setSyllabusText(SAMPLE_SYLLABUS);
    generateReactFlowData(SAMPLE_SYLLABUS);
  };

  const handleTextChange = (text: string) => {
    setSyllabusText(text);
    generateReactFlowData(text);
  };

  const getYouTubeLinks = (nodeLabel: string) => {
    const query = encodeURIComponent(nodeLabel + ' tutorial');
    return [
      { title: `${nodeLabel} - Full Tutorial`, url: `https://www.youtube.com/results?search_query=${query}` },
      { title: `${nodeLabel} - Easy Explanation`, url: `https://www.youtube.com/results?search_query=${query}+easy` },
      { title: `${nodeLabel} - Practice Problems`, url: `https://www.youtube.com/results?search_query=${query}+problems` },
    ];
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Input Section */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Input Syllabus</CardTitle>
            <CardDescription>Paste your syllabus content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              placeholder="Paste your syllabus here or click 'Load Sample'..."
              value={syllabusText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full h-48 resize-none p-3 rounded-md bg-white/5 border border-white/10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="textarea-syllabus"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleLoadSample}
              className="w-full gap-2"
              data-testid="button-load-sample"
            >
              <Plus className="w-4 h-4" />
              Load Sample Syllabus
            </Button>
            {nodes.length > 0 && (
              <Badge className="w-full justify-center" data-testid="badge-nodes-count">
                {nodes.filter(n => n.type === 'parentNode').length} Units, {nodes.filter(n => n.type === 'childNode').length} Topics
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Visualization Section */}
        <Card className="glass-card lg:col-span-3">
          <CardHeader>
            <CardTitle>Mind Map Visualization</CardTitle>
            <CardDescription>
              {nodes.length === 0 ? 'Enter syllabus to see mind map' : 'Click nodes to view resources'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nodes.length > 0 ? (
              <div className="h-96 w-full rounded-xl border border-white/10 overflow-hidden bg-black/20">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={{
                    parentNode: ParentNode,
                    childNode: ChildNode,
                  }}
                  fitView
                  onNodeClick={(_, node) => setSelectedNode(node.id)}
                  attributionPosition="bottom-right"
                >
                  <Background color="#444" gap={16} />
                  <Controls />
                </ReactFlow>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 opacity-50 mx-auto mb-2" />
                  <p>Enter syllabus content to visualize topics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resources Drawer */}
      {selectedNode && selectedNodeData && (
        <Card className="glass-card" data-testid="card-resources-drawer">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Resources for: {selectedNodeData.data.label}</CardTitle>
              <CardDescription>Recommended YouTube videos</CardDescription>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSelectedNode(null)}
              data-testid="button-close-drawer"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                {getYouTubeLinks(selectedNodeData.data.label).map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg hover-elevate border border-white/10 bg-white/5 transition-colors"
                    data-testid={`link-youtube-${idx}`}
                  >
                    <div className="p-2 rounded-lg bg-red-500/20 flex-shrink-0">
                      <Youtube className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{link.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">Open on YouTube</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </a>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
