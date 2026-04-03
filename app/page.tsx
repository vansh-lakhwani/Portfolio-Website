import { Suspense } from 'react'
import Hero from '@/components/Hero'
import Education from '@/components/Education'
import Certificates from '@/components/Certificates'
import Projects from '@/components/Projects'
import ProjectsSkeleton from '@/components/ProjectsSkeleton'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Scheduler from '@/components/Scheduler'
import SectionFade from '@/components/SectionFade'
import { fetchGithubRepos } from '@/lib/github'

export const revalidate = 300

async function ProjectsSection() {
  const repos = await fetchGithubRepos(6)
  return <Projects repos={repos} />
}

export default function Home() {
  return (
    <>
      <Hero />

      <SectionFade>
        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectsSection />
        </Suspense>
      </SectionFade>

      <SectionFade>
        <Skills />
      </SectionFade>

      <SectionFade>
        <Education />
      </SectionFade>

      <SectionFade>
        <Certificates />
      </SectionFade>

      <SectionFade>
        <Contact />
      </SectionFade>

      <SectionFade>
        <Scheduler />
      </SectionFade>
    </>
  )
}
