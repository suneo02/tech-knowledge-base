\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{resume}[2015/05/25 An elegant Résumé class]
\LoadClass[11pt]{article}

% disable indent globally
\setlength{\parindent}{0pt}
% some general improvements, defines the XeTeX logo
\RequirePackage{xltxtra}
% use xifthen
\RequirePackage{xifthen}
% use fontawesome
\RequirePackage{fontawesome}
% use xcolor for customizing color
\RequirePackage[usenames,dvipsnames]{xcolor}
\definecolor{ResumeText}{HTML}{1F2937}
\definecolor{ResumeMuted}{HTML}{667085}
\definecolor{ResumeRule}{HTML}{D0D5DD}
\definecolor{ResumeTint}{HTML}{F5F7FA}
\definecolor{ResumeAccent}{HTML}{98A2B3}
% loading fonts
\RequirePackage{fontspec}
% Main document font
\setmainfont[
  BoldFont = {TeX Gyre Heros Bold},
  ItalicFont = {TeX Gyre Heros Italic},
  BoldItalicFont = {TeX Gyre Heros Bold Italic}
]{TeX Gyre Heros}
\setsansfont[
  BoldFont = {TeX Gyre Heros Bold},
  ItalicFont = {TeX Gyre Heros Italic},
  BoldItalicFont = {TeX Gyre Heros Bold Italic}
]{TeX Gyre Heros}
\renewcommand{\familydefault}{\sfdefault}

% \RequirePackage[
% 	a4paper,
% 	left=0.7in,
% 	right=0.7in,
% 	top=0.50in,
% 	bottom=0.5in,
% 	nohead
% ]{geometry}

\RequirePackage[
	a4paper,
	left=0.58in,
	right=0.58in,
	top=0.42in,
	bottom=0.42in,
	nohead
]{geometry}

\RequirePackage{titlesec}
\RequirePackage{enumitem}
\setlist[itemize]{topsep=0.22em, itemsep=0.1em, parsep=0.15ex, partopsep=0pt, leftmargin=1.25pc}
\setlist[enumerate]{topsep=0.22em, itemsep=0.1em, parsep=0.15ex, partopsep=0pt, leftmargin=1.25pc}
\RequirePackage[super]{nth}

\titleformat{\section}
  {\large\bfseries\raggedright\color{ResumeText}}
  {}{0em}
  {\raisebox{0.15ex}{\color{ResumeAccent}\rule{0.85em}{0.85em}}\hspace{0.55em}}
  [\vspace{0.2em}{\color{ResumeRule}\rule{0.32\linewidth}{0.5pt}}]
\titlespacing*{\section}{0cm}{0.68em}{0.32em}

\titleformat{\subsection}
  {\normalsize\bfseries\raggedright\color{ResumeText}}
  {}{0em}
  {}
\titlespacing*{\subsection}{0cm}{0.3em}{0.08em}

\newcommand{\datedsection}[2]{%
  \section[#1]{#1 \hfill #2}%
}
\newcommand{\datedsubsection}[2]{%
  \subsection[#1]{#1 \hfill {\small\color{ResumeMuted}#2}}%
}
\newcommand{\datedline}[2]{%
  {\par #1 \hfill #2 \par}%
}

\newcommand{\name}[1]{
  \centerline{\Huge\scshape{#1}} 
  \vspace{0.6ex}
}
\newcommand{\contactInfo}[2]{
  \centerline{\sffamily\large{\ 手机：{#1} \textperiodcentered\ \ 邮箱：{#2}}} 
  \vspace{1.2ex}
}
\newcommand{\otherInfo}[4]{
  \centerline{\sffamily\large{\ {#1}}
    \ifthenelse{\isempty{#2}}%
      { } % if {#2} is empty
      {\textperiodcentered\ \ {#2} } % homepage, no space before \text...
    \ifthenelse{\isempty{#3}}%
      { } % if {#3} is empty
      {\textperiodcentered\ \ {#3} } % homepage, no space before \text...
    \ifthenelse{\isempty{#4}}%
      { } % if {#3} is empty
      {\textperiodcentered\ \ {#4} }
  }
  \vspace{0.4ex}
}

\newcommand{\yourphoto}[1]{
  \hfill \smash{\includegraphics[width={#1}\paperwidth]{images/you.jpg}}
}

\newcommand{\role}[2]{
  {\par \textit{#1} ~ #2 \par}
  \vspace{0.3ex}
}

% add
\newcommand{\sepspace}{\vspace*{1em}}		        % Vertical space macro

\newcommand{\MyName}[1]{
    \noindent
	{\fontsize{22}{24}\selectfont\textbf{\textcolor{ResumeText}{#1}}} \hfill
	\par \normalsize \normalfont
}

\newcommand{\SimpleEntry}[1]{
	\noindent\hangindent=0.5cm\hangafter=0          % Indentation
	{\small\textcolor{ResumeMuted}{#1}} \par        % Entry 
}

\newcommand{\Content}[3]{
    \begin{itemize}[parsep=0.5ex]
    \item \textit{描述}：#1
    \item \textit{我的职责}：#2
    \item \textit{成果}：#3
    \end{itemize}
	\normalsize \par
}
